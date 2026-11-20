const Room = require('../models/Room');
const Hostel = require('../models/Hostel');
const Allocation = require('../models/Allocation');

// @desc    Get all rooms with filtering and real-time active allocations
// @route   GET /api/rooms
// @access  Public or Protected
const getAllRooms = async (req, res, next) => {
  try {
    const { hostel, floor, roomType, status, search } = req.query;
    const query = {};

    if (hostel) query.hostel = hostel;
    if (floor !== undefined && floor !== '') query.floor = Number(floor);
    if (roomType) query.roomType = roomType;
    if (status) query.status = status;
    if (search) query.roomNumber = { $regex: search, $options: 'i' };

    const rooms = await Room.find(query)
      .populate('hostel', 'name type location')
      .sort({ hostel: 1, floor: 1, roomNumber: 1 });

    // Sync and verify current occupancy from live active allocations to ensure 100% data integrity
    const roomIds = rooms.map((r) => r._id);
    const activeAllocations = await Allocation.find({
      room: { $in: roomIds },
      status: 'Active',
    }).populate('student', 'name email rollNumber course year phoneNumber gender');

    // Group active allocations by room
    const allocMap = {};
    activeAllocations.forEach((alloc) => {
      const rId = alloc.room.toString();
      if (!allocMap[rId]) allocMap[rId] = [];
      allocMap[rId].push(alloc);
    });

    const enrichedRooms = await Promise.all(
      rooms.map(async (room) => {
        const occupants = allocMap[room._id.toString()] || [];
        const actualOccupancy = occupants.length;

        // Auto-correct if mismatch
        if (room.currentOccupancy !== actualOccupancy) {
          room.currentOccupancy = actualOccupancy;
          if (room.status !== 'Maintenance') {
            room.status = actualOccupancy >= room.capacity ? 'Full' : 'Available';
          }
          await room.save();
        }

        const roomObj = room.toObject();
        roomObj.occupants = occupants;
        roomObj.availableBeds = Math.max(0, room.capacity - room.currentOccupancy);
        return roomObj;
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedRooms.length,
      rooms: enrichedRooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room details with occupants
// @route   GET /api/rooms/:id
// @access  Public or Protected
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hostel');
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const occupants = await Allocation.find({
      room: room._id,
      status: 'Active',
    }).populate('student', 'name email rollNumber course year phoneNumber gender');

    const roomObj = room.toObject();
    roomObj.occupants = occupants;
    roomObj.availableBeds = Math.max(0, room.capacity - occupants.length);

    res.status(200).json({
      success: true,
      room: roomObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Admin)
const createRoom = async (req, res, next) => {
  try {
    const { roomNumber, hostel, floor, roomType, capacity, monthlyFee, status, amenities, description } =
      req.body;

    const hostelDoc = await Hostel.findById(hostel);
    if (!hostelDoc) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    // Check if room number already exists in this hostel
    const existing = await Room.findOne({
      hostel,
      roomNumber: roomNumber.trim().toUpperCase(),
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Room ${roomNumber} already exists in hostel ${hostelDoc.name}.`,
      });
    }

    // Determine default capacity if not explicitly provided
    let finalCapacity = Number(capacity);
    if (!finalCapacity) {
      if (roomType === 'Single') finalCapacity = 1;
      else if (roomType === 'Double') finalCapacity = 2;
      else if (roomType === 'Triple') finalCapacity = 3;
      else finalCapacity = 2;
    }

    const room = await Room.create({
      roomNumber: roomNumber.trim().toUpperCase(),
      hostel,
      floor: Number(floor),
      roomType,
      capacity: finalCapacity,
      currentOccupancy: 0,
      monthlyFee: Number(monthlyFee),
      status: status || 'Available',
      amenities: amenities || ['Bed', 'Study Table', 'Cupboard', 'Fan'],
      description: description || '',
    });

    const populatedRoom = await Room.findById(room._id).populate('hostel', 'name type');

    res.status(201).json({
      success: true,
      message: 'Room created successfully!',
      room: populatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Private (Admin)
const updateRoom = async (req, res, next) => {
  try {
    const { roomNumber, floor, roomType, capacity, monthlyFee, status, amenities, description } =
      req.body;

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Check if new roomNumber conflicts with another room in the same hostel
    if (roomNumber && roomNumber.trim().toUpperCase() !== room.roomNumber) {
      const existing = await Room.findOne({
        hostel: room.hostel,
        roomNumber: roomNumber.trim().toUpperCase(),
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Another room with number ${roomNumber} already exists in this hostel.`,
        });
      }
      room.roomNumber = roomNumber.trim().toUpperCase();
    }

    // Capacity validation: cannot reduce capacity below current occupants
    if (capacity !== undefined) {
      const newCap = Number(capacity);
      if (newCap < room.currentOccupancy) {
        return res.status(400).json({
          success: false,
          message: `Cannot set capacity to ${newCap}: Room currently has ${room.currentOccupancy} active occupant(s).`,
        });
      }
      room.capacity = newCap;
    }

    if (floor !== undefined) room.floor = Number(floor);
    if (roomType) room.roomType = roomType;
    if (monthlyFee !== undefined) room.monthlyFee = Number(monthlyFee);
    if (status) room.status = status;
    if (amenities) room.amenities = amenities;
    if (description !== undefined) room.description = description;

    // Recalculate status
    if (room.status !== 'Maintenance') {
      room.status = room.currentOccupancy >= room.capacity ? 'Full' : 'Available';
    }

    await room.save();
    const populated = await Room.findById(room._id).populate('hostel', 'name type');

    res.status(200).json({
      success: true,
      message: 'Room updated successfully!',
      room: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room (only if unoccupied)
// @route   DELETE /api/rooms/:id
// @access  Private (Admin)
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Check active allocations
    const activeAllocations = await Allocation.countDocuments({
      room: room._id,
      status: 'Active',
    });

    if (activeAllocations > 0 || room.currentOccupancy > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete room ${room.roomNumber}: It currently has ${activeAllocations} active student allocation(s). Please vacate all students first.`,
      });
    }

    await Room.findByIdAndDelete(room._id);

    res.status(200).json({
      success: true,
      message: `Room ${room.roomNumber} deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
