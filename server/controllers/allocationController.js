const Allocation = require('../models/Allocation');
const Room = require('../models/Room');
const Hostel = require('../models/Hostel');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Allocate a room to a student (Admin)
// @route   POST /api/allocations
// @access  Private (Admin)
const createAllocation = async (req, res, next) => {
  try {
    const { studentId, roomId, applicationId, remarks, allocationDate } = req.body;

    if (!studentId || !roomId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID and Room ID are required for room allocation.',
      });
    }

    // 1. Verify student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'STUDENT') {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    // 2. Allocation rule: A student cannot have multiple active room allocations
    const existingActiveAllocation = await Allocation.findOne({
      student: studentId,
      status: 'Active',
    });
    if (existingActiveAllocation) {
      return res.status(400).json({
        success: false,
        message: 'Student already has an active room allocation. Please vacate the existing room before allocating a new one.',
      });
    }

    // 3. Find and verify room
    const room = await Room.findById(roomId).populate('hostel');
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found.',
      });
    }

    if (room.status === 'Maintenance') {
      return res.status(400).json({
        success: false,
        message: 'Cannot allocate: Room is currently marked under Maintenance.',
      });
    }

    // 4. Double check live active allocations count to prevent race conditions
    const currentActiveCount = await Allocation.countDocuments({
      room: room._id,
      status: 'Active',
    });

    if (currentActiveCount >= room.capacity) {
      room.currentOccupancy = currentActiveCount;
      room.status = 'Full';
      await room.save();
      return res.status(400).json({
        success: false,
        message: `Room ${room.roomNumber} is full. Capacity is ${room.capacity}, current occupants: ${currentActiveCount}.`,
      });
    }

    // 5. Check application status if applicationId provided
    let appDoc = null;
    if (applicationId) {
      appDoc = await Application.findById(applicationId);
      if (appDoc) {
        // Must be Approved or Pending (admin auto-approves during allocation)
        appDoc.status = 'Allocated';
        appDoc.reviewedBy = req.user._id;
        appDoc.reviewedAt = new Date();
        await appDoc.save();
      }
    } else {
      // Find latest approved application for this student
      appDoc = await Application.findOne({
        student: studentId,
        status: { $in: ['Approved', 'Pending'] },
      }).sort({ createdAt: -1 });

      if (appDoc) {
        appDoc.status = 'Allocated';
        appDoc.reviewedBy = req.user._id;
        appDoc.reviewedAt = new Date();
        await appDoc.save();
      }
    }

    // 6. Create Allocation
    const allocation = await Allocation.create({
      student: studentId,
      room: room._id,
      hostel: room.hostel._id,
      application: appDoc ? appDoc._id : undefined,
      allocationDate: allocationDate ? new Date(allocationDate) : new Date(),
      status: 'Active',
      monthlyFee: room.monthlyFee,
      allocatedBy: req.user._id,
      remarks: remarks || '',
    });

    // 7. Update Room occupancy & status
    room.currentOccupancy = currentActiveCount + 1;
    if (room.currentOccupancy >= room.capacity) {
      room.status = 'Full';
    } else {
      room.status = 'Available';
    }
    await room.save();

    const populatedAllocation = await Allocation.findById(allocation._id)
      .populate('student', 'name email rollNumber course year phoneNumber gender')
      .populate('room', 'roomNumber floor roomType capacity currentOccupancy')
      .populate('hostel', 'name type location')
      .populate('allocatedBy', 'name email');

    res.status(201).json({
      success: true,
      message: `Room ${room.roomNumber} successfully allocated to ${student.name}!`,
      allocation: populatedAllocation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vacate a room allocation (Admin)
// @route   PUT /api/allocations/:id/vacate
// @access  Private (Admin)
const vacateAllocation = async (req, res, next) => {
  try {
    const { vacateRemarks, vacateDate } = req.body;

    const allocation = await Allocation.findById(req.params.id)
      .populate('room')
      .populate('student');

    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation record not found.' });
    }

    if (allocation.status === 'Vacated') {
      return res.status(400).json({
        success: false,
        message: 'This room allocation has already been vacated.',
      });
    }

    // Update allocation
    allocation.status = 'Vacated';
    allocation.vacateDate = vacateDate ? new Date(vacateDate) : new Date();
    allocation.vacatedBy = req.user._id;
    if (vacateRemarks) {
      allocation.vacateRemarks = vacateRemarks.trim();
    }
    await allocation.save();

    // Recalculate room occupancy and restore availability
    if (allocation.room) {
      const room = await Room.findById(allocation.room._id);
      if (room) {
        const remainingOccupants = await Allocation.countDocuments({
          room: room._id,
          status: 'Active',
        });
        room.currentOccupancy = remainingOccupants;
        if (room.status !== 'Maintenance') {
          room.status = remainingOccupants >= room.capacity ? 'Full' : 'Available';
        }
        await room.save();
      }
    }

    const updated = await Allocation.findById(allocation._id)
      .populate('student', 'name email rollNumber course')
      .populate('room', 'roomNumber floor roomType')
      .populate('hostel', 'name')
      .populate('vacatedBy', 'name');

    res.status(200).json({
      success: true,
      message: `Room vacated successfully for ${allocation.student?.name || 'student'}.`,
      allocation: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reassign student to a new room (Admin)
// @route   PUT /api/allocations/:id/reassign
// @access  Private (Admin)
const reassignRoom = async (req, res, next) => {
  try {
    const { newRoomId, remarks } = req.body;

    const allocation = await Allocation.findById(req.params.id);
    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation not found' });
    }

    if (allocation.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reassign an allocation that is not currently Active.',
      });
    }

    const oldRoom = await Room.findById(allocation.room);
    const newRoom = await Room.findById(newRoomId).populate('hostel');

    if (!newRoom) {
      return res.status(404).json({ success: false, message: 'Target room not found' });
    }

    if (oldRoom._id.toString() === newRoom._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Student is already assigned to this room.',
      });
    }

    // Check new room capacity
    const newRoomOccupants = await Allocation.countDocuments({
      room: newRoom._id,
      status: 'Active',
    });

    if (newRoomOccupants >= newRoom.capacity) {
      return res.status(400).json({
        success: false,
        message: `Target room ${newRoom.roomNumber} is full.`,
      });
    }

    // Mark previous allocation as Transferred
    allocation.status = 'Transferred';
    allocation.vacateDate = new Date();
    allocation.vacateRemarks = `Transferred to Room ${newRoom.roomNumber}`;
    await allocation.save();

    // Create new allocation
    const newAlloc = await Allocation.create({
      student: allocation.student,
      room: newRoom._id,
      hostel: newRoom.hostel._id,
      application: allocation.application,
      allocationDate: new Date(),
      status: 'Active',
      monthlyFee: newRoom.monthlyFee,
      allocatedBy: req.user._id,
      remarks: remarks || `Transferred from Room ${oldRoom ? oldRoom.roomNumber : ''}`,
    });

    // Update old room occupancy
    if (oldRoom) {
      const oldRemaining = await Allocation.countDocuments({
        room: oldRoom._id,
        status: 'Active',
      });
      oldRoom.currentOccupancy = oldRemaining;
      if (oldRoom.status !== 'Maintenance') {
        oldRoom.status = oldRemaining >= oldRoom.capacity ? 'Full' : 'Available';
      }
      await oldRoom.save();
    }

    // Update new room occupancy
    newRoom.currentOccupancy = newRoomOccupants + 1;
    if (newRoom.currentOccupancy >= newRoom.capacity) {
      newRoom.status = 'Full';
    } else {
      newRoom.status = 'Available';
    }
    await newRoom.save();

    res.status(200).json({
      success: true,
      message: `Student successfully reassigned to Room ${newRoom.roomNumber}!`,
      allocation: newAlloc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all allocations (Admin)
// @route   GET /api/allocations
// @access  Private (Admin)
const getAllAllocations = async (req, res, next) => {
  try {
    const { status, hostel, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (hostel) {
      query.hostel = hostel;
    }

    let allocations = await Allocation.find(query)
      .populate('student', 'name email rollNumber course year phoneNumber gender')
      .populate('room', 'roomNumber floor roomType capacity currentOccupancy')
      .populate('hostel', 'name type location')
      .populate('allocatedBy', 'name email')
      .populate('vacatedBy', 'name email')
      .sort({ createdAt: -1 });

    if (search) {
      const term = search.toLowerCase();
      allocations = allocations.filter((alloc) => {
        const studentName = alloc.student?.name?.toLowerCase() || '';
        const rollNumber = alloc.student?.rollNumber?.toLowerCase() || '';
        const roomNumber = alloc.room?.roomNumber?.toLowerCase() || '';
        const hostelName = alloc.hostel?.name?.toLowerCase() || '';
        return (
          studentName.includes(term) ||
          rollNumber.includes(term) ||
          roomNumber.includes(term) ||
          hostelName.includes(term)
        );
      });
    }

    res.status(200).json({
      success: true,
      count: allocations.length,
      allocations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student's current room allocation & roommates
// @route   GET /api/allocations/my
// @access  Private (Student)
const getMyAllocation = async (req, res, next) => {
  try {
    const activeAllocation = await Allocation.findOne({
      student: req.user._id,
      status: 'Active',
    })
      .populate('room')
      .populate('hostel')
      .populate('allocatedBy', 'name email');

    if (!activeAllocation) {
      return res.status(200).json({
        success: true,
        hasAllocation: false,
        allocation: null,
        roommates: [],
      });
    }

    // Find roommates (other active allocations in the same room)
    const roommatesAlloc = await Allocation.find({
      room: activeAllocation.room._id,
      status: 'Active',
      student: { $ne: req.user._id },
    }).populate('student', 'name email rollNumber course year phoneNumber gender');

    const roommates = roommatesAlloc.map((a) => a.student).filter(Boolean);

    res.status(200).json({
      success: true,
      hasAllocation: true,
      allocation: activeAllocation,
      roommates,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAllocation,
  vacateAllocation,
  reassignRoom,
  getAllAllocations,
  getMyAllocation,
};
