const User = require('../models/User');
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Application = require('../models/Application');
const Allocation = require('../models/Allocation');

// @desc    Get Admin Dashboard Analytics & Charts
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
const getAdminDashboard = async (req, res, next) => {
  try {
    // 1. Basic Counts
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    const totalHostels = await Hostel.countDocuments();
    const totalRooms = await Room.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'Pending' });
    const approvedApplications = await Application.countDocuments({ status: 'Approved' });
    const rejectedApplications = await Application.countDocuments({ status: 'Rejected' });
    const allocatedApplications = await Application.countDocuments({ status: 'Allocated' });

    // 2. Room & Bed Analytics
    const allRooms = await Room.find();
    let totalBedCapacity = 0;
    let totalOccupiedBeds = 0;
    let availableRoomsCount = 0;
    let fullRoomsCount = 0;
    let maintenanceRoomsCount = 0;

    allRooms.forEach((room) => {
      totalBedCapacity += room.capacity;
      totalOccupiedBeds += room.currentOccupancy;
      if (room.status === 'Full' || room.currentOccupancy >= room.capacity) {
        fullRoomsCount++;
      } else if (room.status === 'Maintenance') {
        maintenanceRoomsCount++;
      } else {
        availableRoomsCount++;
      }
    });

    const availableBeds = Math.max(0, totalBedCapacity - totalOccupiedBeds);
    const overallOccupancyRate =
      totalBedCapacity > 0 ? Math.round((totalOccupiedBeds / totalBedCapacity) * 100) : 0;

    // 3. Hostel-wise Breakdown
    const hostels = await Hostel.find();
    const hostelBreakdown = await Promise.all(
      hostels.map(async (hostel) => {
        const rooms = await Room.find({ hostel: hostel._id });
        const hostelCap = rooms.reduce((acc, r) => acc + r.capacity, 0);
        const hostelOcc = rooms.reduce((acc, r) => acc + r.currentOccupancy, 0);
        return {
          id: hostel._id,
          name: hostel.name,
          type: hostel.type,
          rooms: rooms.length,
          capacity: hostelCap,
          occupied: hostelOcc,
          available: Math.max(0, hostelCap - hostelOcc),
          occupancyRate: hostelCap > 0 ? Math.round((hostelOcc / hostelCap) * 100) : 0,
        };
      })
    );

    // 4. Application Status Chart Data
    const applicationStatusData = [
      { name: 'Pending', count: pendingApplications, color: '#f59e0b' },
      { name: 'Approved', count: approvedApplications, color: '#eab308' },
      { name: 'Allocated', count: allocatedApplications, color: '#10b981' },
      { name: 'Rejected', count: rejectedApplications, color: '#f43f5e' },
    ];

    // 5. Room Type Distribution
    const roomTypeStats = await Room.aggregate([
      {
        $group: {
          _id: '$roomType',
          totalRooms: { $sum: 1 },
          totalCapacity: { $sum: '$capacity' },
          totalOccupied: { $sum: '$currentOccupancy' },
        },
      },
    ]);

    // 6. Recent Applications (Latest 5)
    const recentApplications = await Application.find()
      .populate('student', 'name email rollNumber course gender')
      .populate('preferredHostel', 'name type')
      .sort({ createdAt: -1 })
      .limit(5);

    // 7. Recent Allocations (Latest 5)
    const recentAllocations = await Allocation.find({ status: 'Active' })
      .populate('student', 'name email rollNumber course')
      .populate('room', 'roomNumber floor roomType')
      .populate('hostel', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalHostels,
        totalRooms,
        availableRooms: availableRoomsCount,
        occupiedRooms: fullRoomsCount,
        maintenanceRooms: maintenanceRoomsCount,
        totalBedCapacity,
        totalOccupiedBeds,
        availableBeds,
        overallOccupancyRate,
        pendingApplications,
        approvedApplications,
        allocatedApplications,
        rejectedApplications,
      },
      hostelBreakdown,
      applicationStatusData,
      roomTypeStats,
      recentApplications,
      recentAllocations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Student Dashboard Info
// @route   GET /api/dashboard/student
// @access  Private (Student)
const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    // Student profile
    const student = await User.findById(studentId);

    // Active Room Allocation
    const activeAllocation = await Allocation.findOne({
      student: studentId,
      status: 'Active',
    })
      .populate('room')
      .populate('hostel')
      .populate('allocatedBy', 'name');

    // Roommates (if allocated)
    let roommates = [];
    if (activeAllocation && activeAllocation.room) {
      const otherAllocations = await Allocation.find({
        room: activeAllocation.room._id,
        status: 'Active',
        student: { $ne: studentId },
      }).populate('student', 'name email rollNumber course year phoneNumber gender');
      roommates = otherAllocations.map((a) => a.student).filter(Boolean);
    }

    // Latest Application
    const latestApplication = await Application.findOne({ student: studentId })
      .populate('preferredHostel', 'name type location')
      .sort({ createdAt: -1 });

    // Available Rooms Overview (for application browsing)
    const availableRooms = await Room.find({
      status: 'Available',
    })
      .populate('hostel', 'name type location')
      .select('roomNumber hostel floor roomType capacity currentOccupancy monthlyFee');

    res.status(200).json({
      success: true,
      student: student.toJSON(),
      allocation: activeAllocation,
      roommates,
      latestApplication,
      availableRoomsCount: availableRooms.length,
      availableRoomsSample: availableRooms.slice(0, 6),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getStudentDashboard,
};
