const User = require('../models/User');
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Application = require('../models/Application');
const Allocation = require('../models/Allocation');

// Helper to escape CSV fields
const escapeCSV = (field) => {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
};

// @desc    Get reports data with date and category filters
// @route   GET /api/reports/summary
// @access  Private (Admin)
const getReportSummary = async (req, res, next) => {
  try {
    const { startDate, endDate, hostelId } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.$lte = end;
    }

    // 1. Student Registrations Report
    const studentQuery = { role: 'STUDENT' };
    if (startDate || endDate) studentQuery.createdAt = dateFilter;
    const students = await User.find(studentQuery).sort({ createdAt: -1 });

    // 2. Hostel Occupancy Report
    const hostelQuery = hostelId ? { _id: hostelId } : {};
    const hostels = await Hostel.find(hostelQuery);
    const hostelReports = await Promise.all(
      hostels.map(async (h) => {
        const rooms = await Room.find({ hostel: h._id });
        const totalRooms = rooms.length;
        const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
        const occupied = rooms.reduce((acc, r) => acc + r.currentOccupancy, 0);
        return {
          id: h._id,
          name: h.name,
          type: h.type,
          location: h.location,
          totalFloors: h.totalFloors,
          totalRooms,
          totalCapacity,
          occupiedBeds: occupied,
          availableBeds: Math.max(0, totalCapacity - occupied),
          occupancyRate:
            totalCapacity > 0 ? Math.round((occupied / totalCapacity) * 100) : 0,
        };
      })
    );

    // 3. Room Availability Report
    const roomQuery = {};
    if (hostelId) roomQuery.hostel = hostelId;
    const rooms = await Room.find(roomQuery)
      .populate('hostel', 'name type')
      .sort({ hostel: 1, floor: 1, roomNumber: 1 });

    // 4. Allocation History Report
    const allocQuery = {};
    if (startDate || endDate) allocQuery.allocationDate = dateFilter;
    if (hostelId) allocQuery.hostel = hostelId;
    const allocations = await Allocation.find(allocQuery)
      .populate('student', 'name email rollNumber course year phoneNumber gender')
      .populate('room', 'roomNumber floor roomType')
      .populate('hostel', 'name type')
      .populate('allocatedBy', 'name email')
      .sort({ createdAt: -1 });

    // 5. Pending Applications Report
    const appQuery = { status: 'Pending' };
    if (startDate || endDate) appQuery.createdAt = dateFilter;
    if (hostelId) appQuery.preferredHostel = hostelId;
    const pendingApplications = await Application.find(appQuery)
      .populate('student', 'name email rollNumber course year phoneNumber gender')
      .populate('preferredHostel', 'name type')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        studentsCount: students.length,
        hostelReports,
        roomsCount: rooms.length,
        allocationsCount: allocations.length,
        pendingCount: pendingApplications.length,
        students: students.map((s) => s.toJSON()),
        rooms,
        allocations,
        pendingApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export specific report as CSV
// @route   GET /api/reports/export/:type
// @access  Private (Admin)
const exportReportCSV = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { startDate, endDate, hostelId } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.$lte = end;
    }

    let csvContent = '';
    let filename = `report_${type}_${Date.now()}.csv`;

    switch (type) {
      case 'students': {
        const query = { role: 'STUDENT' };
        if (startDate || endDate) query.createdAt = dateFilter;
        const students = await User.find(query).sort({ createdAt: -1 });

        const headers = [
          'Full Name',
          'Email',
          'Roll Number',
          'Course',
          'Year',
          'Phone Number',
          'Gender',
          'Registration Date',
        ];
        csvContent = headers.join(',') + '\n';

        students.forEach((s) => {
          const row = [
            escapeCSV(s.name),
            escapeCSV(s.email),
            escapeCSV(s.rollNumber || 'N/A'),
            escapeCSV(s.course || 'N/A'),
            escapeCSV(s.year || 'N/A'),
            escapeCSV(s.phoneNumber || 'N/A'),
            escapeCSV(s.gender || 'N/A'),
            escapeCSV(new Date(s.createdAt).toLocaleDateString()),
          ];
          csvContent += row.join(',') + '\n';
        });
        break;
      }

      case 'hostels': {
        const query = hostelId ? { _id: hostelId } : {};
        const hostels = await Hostel.find(query);
        const headers = [
          'Hostel Name',
          'Type',
          'Location',
          'Total Floors',
          'Total Rooms',
          'Total Capacity (Beds)',
          'Occupied Beds',
          'Available Beds',
          'Occupancy Rate (%)',
        ];
        csvContent = headers.join(',') + '\n';

        for (const h of hostels) {
          const rooms = await Room.find({ hostel: h._id });
          const totalRooms = rooms.length;
          const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
          const occupied = rooms.reduce((acc, r) => acc + r.currentOccupancy, 0);
          const rate =
            totalCapacity > 0 ? Math.round((occupied / totalCapacity) * 100) : 0;

          const row = [
            escapeCSV(h.name),
            escapeCSV(h.type),
            escapeCSV(h.location),
            escapeCSV(h.totalFloors),
            escapeCSV(totalRooms),
            escapeCSV(totalCapacity),
            escapeCSV(occupied),
            escapeCSV(Math.max(0, totalCapacity - occupied)),
            escapeCSV(`${rate}%`),
          ];
          csvContent += row.join(',') + '\n';
        }
        break;
      }

      case 'rooms': {
        const query = {};
        if (hostelId) query.hostel = hostelId;
        const rooms = await Room.find(query)
          .populate('hostel', 'name type')
          .sort({ hostel: 1, floor: 1, roomNumber: 1 });

        const headers = [
          'Hostel',
          'Room Number',
          'Floor',
          'Room Type',
          'Capacity',
          'Current Occupancy',
          'Available Beds',
          'Monthly Fee',
          'Status',
        ];
        csvContent = headers.join(',') + '\n';

        rooms.forEach((r) => {
          const avail = Math.max(0, r.capacity - r.currentOccupancy);
          const row = [
            escapeCSV(r.hostel?.name || 'N/A'),
            escapeCSV(r.roomNumber),
            escapeCSV(r.floor),
            escapeCSV(r.roomType),
            escapeCSV(r.capacity),
            escapeCSV(r.currentOccupancy),
            escapeCSV(avail),
            escapeCSV(r.monthlyFee),
            escapeCSV(r.status),
          ];
          csvContent += row.join(',') + '\n';
        });
        break;
      }

      case 'allocations': {
        const query = {};
        if (startDate || endDate) query.allocationDate = dateFilter;
        if (hostelId) query.hostel = hostelId;
        const allocations = await Allocation.find(query)
          .populate('student', 'name email rollNumber course year')
          .populate('room', 'roomNumber floor roomType')
          .populate('hostel', 'name')
          .sort({ allocationDate: -1 });

        const headers = [
          'Student Name',
          'Roll Number',
          'Email',
          'Course',
          'Hostel',
          'Room Number',
          'Room Type',
          'Monthly Fee',
          'Allocation Date',
          'Status',
          'Vacate Date',
        ];
        csvContent = headers.join(',') + '\n';

        allocations.forEach((a) => {
          const row = [
            escapeCSV(a.student?.name || 'N/A'),
            escapeCSV(a.student?.rollNumber || 'N/A'),
            escapeCSV(a.student?.email || 'N/A'),
            escapeCSV(a.student?.course || 'N/A'),
            escapeCSV(a.hostel?.name || 'N/A'),
            escapeCSV(a.room?.roomNumber || 'N/A'),
            escapeCSV(a.room?.roomType || 'N/A'),
            escapeCSV(a.monthlyFee),
            escapeCSV(new Date(a.allocationDate).toLocaleDateString()),
            escapeCSV(a.status),
            escapeCSV(a.vacateDate ? new Date(a.vacateDate).toLocaleDateString() : 'N/A'),
          ];
          csvContent += row.join(',') + '\n';
        });
        break;
      }

      case 'pending-applications': {
        const query = { status: 'Pending' };
        if (startDate || endDate) query.createdAt = dateFilter;
        if (hostelId) query.preferredHostel = hostelId;
        const pending = await Application.find(query)
          .populate('student', 'name email rollNumber course year phoneNumber gender')
          .populate('preferredHostel', 'name type')
          .sort({ createdAt: -1 });

        const headers = [
          'Application Number',
          'Student Name',
          'Roll Number',
          'Email',
          'Phone Number',
          'Course',
          'Preferred Hostel',
          'Preferred Room Type',
          'Preferred Floor',
          'Application Date',
          'Status',
        ];
        csvContent = headers.join(',') + '\n';

        pending.forEach((p) => {
          const row = [
            escapeCSV(p.applicationNumber),
            escapeCSV(p.student?.name || 'N/A'),
            escapeCSV(p.student?.rollNumber || 'N/A'),
            escapeCSV(p.student?.email || 'N/A'),
            escapeCSV(p.student?.phoneNumber || 'N/A'),
            escapeCSV(p.student?.course || 'N/A'),
            escapeCSV(p.preferredHostel?.name || 'N/A'),
            escapeCSV(p.roomType),
            escapeCSV(p.preferredFloor),
            escapeCSV(new Date(p.createdAt).toLocaleDateString()),
            escapeCSV(p.status),
          ];
          csvContent += row.join(',') + '\n';
        });
        break;
      }

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type requested for export.',
        });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReportSummary,
  exportReportCSV,
};
