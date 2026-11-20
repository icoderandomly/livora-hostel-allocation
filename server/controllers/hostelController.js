const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Allocation = require('../models/Allocation');

// @desc    Get all hostels with occupancy summary
// @route   GET /api/hostels
// @access  Public or Protected
const getAllHostels = async (req, res, next) => {
  try {
    const { search, type } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    const hostels = await Hostel.find(query).sort({ name: 1 });

    // Aggregate room and occupancy stats for each hostel
    const hostelStats = await Promise.all(
      hostels.map(async (hostel) => {
        const rooms = await Room.find({ hostel: hostel._id });
        const totalRooms = rooms.length;
        const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
        const occupiedBeds = rooms.reduce((acc, r) => acc + r.currentOccupancy, 0);
        const availableBeds = Math.max(0, totalCapacity - occupiedBeds);
        const occupancyRate =
          totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

        return {
          ...hostel.toObject(),
          totalRooms,
          totalCapacity,
          occupiedBeds,
          availableBeds,
          occupancyRate,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: hostelStats.length,
      hostels: hostelStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hostel with room breakdown
// @route   GET /api/hostels/:id
// @access  Public or Protected
const getHostelById = async (req, res, next) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    const rooms = await Room.find({ hostel: hostel._id }).sort({
      floor: 1,
      roomNumber: 1,
    });
    const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
    const occupiedBeds = rooms.reduce((acc, r) => acc + r.currentOccupancy, 0);

    res.status(200).json({
      success: true,
      hostel: {
        ...hostel.toObject(),
        totalRooms: rooms.length,
        totalCapacity,
        occupiedBeds,
        availableBeds: Math.max(0, totalCapacity - occupiedBeds),
      },
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new hostel
// @route   POST /api/hostels
// @access  Private (Admin)
const createHostel = async (req, res, next) => {
  try {
    const { name, type, location, totalFloors, description, wardenName, wardenContact } =
      req.body;

    const existing = await Hostel.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A hostel with this name already exists.',
      });
    }

    const hostel = await Hostel.create({
      name: name.trim(),
      type,
      location: location.trim(),
      totalFloors: Number(totalFloors),
      description: description || '',
      wardenName: wardenName || '',
      wardenContact: wardenContact || '',
    });

    res.status(201).json({
      success: true,
      message: 'Hostel created successfully!',
      hostel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hostel details
// @route   PUT /api/hostels/:id
// @access  Private (Admin)
const updateHostel = async (req, res, next) => {
  try {
    const { name, type, location, totalFloors, description, wardenName, wardenContact } =
      req.body;

    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    // Check name uniqueness if changing
    if (name && name.trim() !== hostel.name) {
      const existing = await Hostel.findOne({ name: name.trim() });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Another hostel already has this name.',
        });
      }
      hostel.name = name.trim();
    }

    if (type) hostel.type = type;
    if (location) hostel.location = location.trim();
    if (totalFloors) hostel.totalFloors = Number(totalFloors);
    if (description !== undefined) hostel.description = description;
    if (wardenName !== undefined) hostel.wardenName = wardenName;
    if (wardenContact !== undefined) hostel.wardenContact = wardenContact;

    await hostel.save();

    res.status(200).json({
      success: true,
      message: 'Hostel updated successfully!',
      hostel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hostel (only if no active allocations exist)
// @route   DELETE /api/hostels/:id
// @access  Private (Admin)
const deleteHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    // Check for active allocations in this hostel
    const activeAllocations = await Allocation.countDocuments({
      hostel: hostel._id,
      status: 'Active',
    });

    if (activeAllocations > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete hostel: There are ${activeAllocations} active student room allocation(s). Please vacate all rooms before deleting.`,
      });
    }

    // Remove all associated rooms
    await Room.deleteMany({ hostel: hostel._id });
    await Hostel.findByIdAndDelete(hostel._id);

    res.status(200).json({
      success: true,
      message: 'Hostel and associated rooms deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
};
