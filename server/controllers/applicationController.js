const Application = require('../models/Application');
const Allocation = require('../models/Allocation');
const Hostel = require('../models/Hostel');
const User = require('../models/User');

// @desc    Submit new hostel application (Student)
// @route   POST /api/applications
// @access  Private (Student)
const createApplication = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { preferredHostel, roomType, preferredFloor, personalDetails } = req.body;

    // Check if student already has an active room allocation
    const activeAllocation = await Allocation.findOne({
      student: studentId,
      status: 'Active',
    });
    if (activeAllocation) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active hostel room allocated. You cannot apply again while having an active allocation.',
      });
    }

    // Check if student already has a pending or approved application
    const existingActiveApp = await Application.findOne({
      student: studentId,
      status: { $in: ['Pending', 'Approved'] },
    });
    if (existingActiveApp) {
      return res.status(400).json({
        success: false,
        message: `You already have an active application (${existingActiveApp.applicationNumber}) with status '${existingActiveApp.status}'.`,
      });
    }

    // Verify hostel exists
    const hostel = await Hostel.findById(preferredHostel);
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Selected hostel does not exist.',
      });
    }

    // Floor validation
    if (preferredFloor && (preferredFloor < 0 || preferredFloor > hostel.totalFloors)) {
      return res.status(400).json({
        success: false,
        message: `Preferred floor must be between 0 and ${hostel.totalFloors} for ${hostel.name}.`,
      });
    }

    const application = await Application.create({
      student: studentId,
      preferredHostel,
      roomType,
      preferredFloor: preferredFloor || 1,
      personalDetails: personalDetails || {},
      status: 'Pending',
    });

    const populatedApp = await Application.findById(application._id)
      .populate('student', 'name email rollNumber course year phoneNumber gender')
      .populate('preferredHostel', 'name type location');

    res.status(201).json({
      success: true,
      message: 'Hostel application submitted successfully!',
      application: populatedApp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student's applications
// @route   GET /api/applications/my
// @access  Private (Student)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('preferredHostel', 'name type location totalFloors')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications with filters (Admin)
// @route   GET /api/applications
// @access  Private (Admin)
const getAllApplications = async (req, res, next) => {
  try {
    const { status, hostel, roomType, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (hostel) {
      query.preferredHostel = hostel;
    }

    if (roomType) {
      query.roomType = roomType;
    }

    let applications = await Application.find(query)
      .populate('student', 'name email rollNumber course year phoneNumber gender')
      .populate('preferredHostel', 'name type location')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    if (search) {
      const term = search.toLowerCase();
      applications = applications.filter((app) => {
        const studentName = app.student?.name?.toLowerCase() || '';
        const rollNumber = app.student?.rollNumber?.toLowerCase() || '';
        const appNum = app.applicationNumber?.toLowerCase() || '';
        const course = app.student?.course?.toLowerCase() || '';
        return (
          studentName.includes(term) ||
          rollNumber.includes(term) ||
          appNum.includes(term) ||
          course.includes(term)
        );
      });
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Approve or Reject with remarks)
// @route   PUT /api/applications/:id/status
// @access  Private (Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, adminRemarks } = req.body;

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'Approved', 'Rejected', or 'Pending'.",
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // If application was already allocated, cannot revert to pending/rejected without vacating room
    if (application.status === 'Allocated' && status !== 'Allocated') {
      return res.status(400).json({
        success: false,
        message: 'This application already has an allocated room. To modify, please vacate or reassign the allocation first.',
      });
    }

    application.status = status;
    if (adminRemarks !== undefined) {
      application.adminRemarks = adminRemarks.trim();
    }
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();

    await application.save();

    const updated = await Application.findById(application._id)
      .populate('student', 'name email rollNumber course year phoneNumber gender')
      .populate('preferredHostel', 'name type location')
      .populate('reviewedBy', 'name email');

    res.status(200).json({
      success: true,
      message: `Application marked as ${status}.`,
      application: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
};
