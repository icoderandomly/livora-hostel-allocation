import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Building2,
  Users,
  DoorOpen,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { reportService, hostelService } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/LoadingSpinner';
import { useToast } from '../../components/common/Toast';

export const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('occupancy'); // 'occupancy', 'students', 'rooms', 'allocations', 'pending'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedHostel, setSelectedHostel] = useState('');
  const [hostels, setHostels] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchHostels = async () => {
    try {
      const res = await hostelService.getAll();
      if (res.data.success) {
        setHostels(res.data.hostels);
      }
    } catch {}
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportService.getSummary({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        hostelId: selectedHostel || undefined,
      });
      if (res.data.success) {
        setReportData(res.data.data);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to generate reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate, selectedHostel]);

  const handleExportCSV = async () => {
    try {
      setDownloading(true);
      let type = 'hostels';
      if (selectedReport === 'students') type = 'students';
      else if (selectedReport === 'rooms') type = 'rooms';
      else if (selectedReport === 'allocations') type = 'allocations';
      else if (selectedReport === 'pending') type = 'pending-applications';

      const response = await reportService.exportCSV(type, {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        hostelId: selectedHostel || undefined,
      });

      // Create download anchor
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `hostel_report_${type}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      success('CSV report downloaded successfully!');
    } catch (err) {
      toastError('Failed to download CSV export');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c1429]/90 p-6 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
            Institutional Reports & Audit Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate and export university hostel occupancy, room availability, and allocation compliance reports.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-semibold shadow-md shadow-indigo-950/50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Exporting...' : 'Export to CSV'}</span>
        </button>
      </div>

      {/* Filter and Date Range Bar */}
      <div className="bg-[#0c1429]/90 p-4 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Report Category
          </label>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 font-semibold text-slate-200"
          >
            <option value="occupancy">Hostel Occupancy Report</option>
            <option value="rooms">Room Availability Report</option>
            <option value="allocations">Allocation History Report</option>
            <option value="pending">Pending Applications Report</option>
            <option value="students">Student Registrations Report</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Filter Hostel
          </label>
          <select
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200"
          >
            <option value="">All Campus Hostels</option>
            {hostels.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200"
          />
        </div>
      </div>

      {/* Report Data Views */}
      <div className="bg-[#0c1429]/90 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* View 1: Hostel Occupancy */}
            {selectedReport === 'occupancy' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#070e24]/90 border-b border-indigo-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Hostel Name</th>
                    <th className="py-3.5 px-4">Type & Location</th>
                    <th className="py-3.5 px-4">Floors & Rooms</th>
                    <th className="py-3.5 px-4">Capacity (Beds)</th>
                    <th className="py-3.5 px-4">Occupied Beds</th>
                    <th className="py-3.5 px-4">Available Beds</th>
                    <th className="py-3.5 px-4">Occupancy Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/50 text-xs">
                  {reportData?.hostelReports?.map((h) => (
                    <tr key={h.id} className="hover:bg-indigo-950/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{h.name}</td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="font-semibold text-indigo-400">{h.type}</span> • {h.location}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {h.totalFloors} floors, {h.totalRooms} rooms
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">{h.totalCapacity}</td>
                      <td className="py-3.5 px-4 font-semibold text-indigo-400">{h.occupiedBeds}</td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-400">{h.availableBeds}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{h.occupancyRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* View 2: Room Availability */}
            {selectedReport === 'rooms' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#070e24]/90 border-b border-indigo-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Hostel</th>
                    <th className="py-3.5 px-4">Room No.</th>
                    <th className="py-3.5 px-4">Floor</th>
                    <th className="py-3.5 px-4">Room Type</th>
                    <th className="py-3.5 px-4">Capacity</th>
                    <th className="py-3.5 px-4">Occupied</th>
                    <th className="py-3.5 px-4">Free Beds</th>
                    <th className="py-3.5 px-4">Monthly Fee</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/50 text-xs">
                  {reportData?.rooms?.map((r) => (
                    <tr key={r._id} className="hover:bg-indigo-950/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{r.hostel?.name}</td>
                      <td className="py-3.5 px-4 font-semibold text-indigo-400">{r.roomNumber}</td>
                      <td className="py-3.5 px-4 text-slate-300">Floor {r.floor}</td>
                      <td className="py-3.5 px-4 text-slate-300">{r.roomType}</td>
                      <td className="py-3.5 px-4 text-slate-300">{r.capacity}</td>
                      <td className="py-3.5 px-4 text-slate-300">{r.currentOccupancy}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        {Math.max(0, r.capacity - r.currentOccupancy)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-200 font-semibold">₹{r.monthlyFee?.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <Badge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* View 3: Allocation History */}
            {selectedReport === 'allocations' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#070e24]/90 border-b border-indigo-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Roll Number</th>
                    <th className="py-3.5 px-4">Hostel & Room</th>
                    <th className="py-3.5 px-4">Room Type</th>
                    <th className="py-3.5 px-4">Allocated Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Vacate Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/50 text-xs">
                  {reportData?.allocations?.map((a) => (
                    <tr key={a._id} className="hover:bg-indigo-950/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{a.student?.name}</td>
                      <td className="py-3.5 px-4 font-mono text-indigo-400">{a.student?.rollNumber}</td>
                      <td className="py-3.5 px-4 text-slate-200">
                        {a.hostel?.name} (Room {a.room?.roomNumber})
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{a.room?.roomType}</td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {new Date(a.allocationDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={a.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {a.vacateDate ? new Date(a.vacateDate).toLocaleDateString() : 'Active Occupant'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* View 4: Pending Applications */}
            {selectedReport === 'pending' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#070e24]/90 border-b border-indigo-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Application No.</th>
                    <th className="py-3.5 px-4">Applicant</th>
                    <th className="py-3.5 px-4">Course</th>
                    <th className="py-3.5 px-4">Hostel Preference</th>
                    <th className="py-3.5 px-4">Type & Floor</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/50 text-xs">
                  {reportData?.pendingApplications?.map((p) => (
                    <tr key={p._id} className="hover:bg-indigo-950/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                        {p.applicationNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">{p.student?.name}</td>
                      <td className="py-3.5 px-4 text-slate-300">{p.student?.course}</td>
                      <td className="py-3.5 px-4 text-slate-200">{p.preferredHostel?.name}</td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {p.roomType} (Floor {p.preferredFloor})
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* View 5: Students Report */}
            {selectedReport === 'students' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#070e24]/90 border-b border-indigo-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Roll Number</th>
                    <th className="py-3.5 px-4">Course</th>
                    <th className="py-3.5 px-4">Year</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Gender</th>
                    <th className="py-3.5 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/50 text-xs">
                  {reportData?.students?.map((s) => (
                    <tr key={s._id} className="hover:bg-indigo-950/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{s.name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{s.email}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-indigo-400">{s.rollNumber}</td>
                      <td className="py-3.5 px-4 text-slate-300">{s.course}</td>
                      <td className="py-3.5 px-4 text-slate-300">{s.year}</td>
                      <td className="py-3.5 px-4 text-slate-300">{s.phoneNumber}</td>
                      <td className="py-3.5 px-4 text-slate-300">{s.gender}</td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
