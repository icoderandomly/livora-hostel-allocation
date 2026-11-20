const User = require('../models/User');
const Allocation = require('../models/Allocation');
const Application = require('../models/Application');

// @desc    Get all students (Admin)
// @route   GET /api/students
// @access  Private (Admin)
const getAllStudents = async (req, res, next) => {
  try {
    const { search, course, gender, page = 1, limit = 50 } = req.query;

    const query = { role: 'STUDENT' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } },
      ];
    }

    if (course) {
      query.course = course;
    }

    if (gender) {
      query.gender = gender;
    }

    const total = await User.countDocuments(query);
    const students = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Enrich with active allocation if exists
    const studentIds = students.map((s) => s._id);
    const activeAllocations = await Allocation.find({
      student: { $in: studentIds },
      status: 'Active',
    })
      .populate('hostel', 'name type')
      .populate('room', 'roomNumber floor roomType');

    const allocationMap = {};
    activeAllocations.forEach((alloc) => {
      allocationMap[alloc.student.toString()] = alloc;
    });

    const enrichedStudents = students.map((student) => {
      const studentObj = student.toJSON();
      studentObj.activeAllocation = allocationMap[student._id.toString()] || null;
      return studentObj;
    });

    res.status(200).json({
      success: true,
      count: enrichedStudents.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      students: enrichedStudents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student details with history (Admin or Student self)
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    // Only Admin can view other students' profiles
    if (req.user.role !== 'ADMIN' && req.user._id.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only view your own student profile.',
      });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'STUDENT') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Fetch active allocation
    const activeAllocation = await Allocation.findOne({
      student: student._id,
      status: 'Active',
    })
      .populate('hostel')
      .populate('room');

    // Fetch all applications
    const applications = await Application.find({ student: student._id })
      .populate('preferredHostel', 'name type')
      .sort({ createdAt: -1 });

    // Fetch allocation history
    const allocationHistory = await Allocation.find({ student: student._id })
      .populate('hostel', 'name')
      .populate('room', 'roomNumber floor roomType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      student: student.toJSON(),
      activeAllocation,
      applications,
      allocationHistory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student (Admin)
// @route   PUT /api/students/:id
// @access  Private (Admin)
const updateStudent = async (req, res, next) => {
  try {
    const { name, course, year, phoneNumber, gender, isActive } = req.body;

    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'STUDENT') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (name) student.name = name;
    if (course) student.course = course;
    if (year) student.year = year;
    if (phoneNumber) student.phoneNumber = phoneNumber;
    if (gender) student.gender = gender;
    if (typeof isActive === 'boolean') student.isActive = isActive;

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student record updated successfully',
      student: student.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudent,
};
