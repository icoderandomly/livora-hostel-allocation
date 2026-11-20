import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  DoorOpen,
  User,
  Building2,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRightLeft,
  LogOut,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { allocationService, roomService, applicationService, studentService } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { TableSkeleton } from '../../components/common/LoadingSpinner';
import { useToast } from '../../components/common/Toast';
import confetti from 'canvas-confetti';

export const RoomAllocation = () => {
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'awaiting', 'history'
  const [allocations, setAllocations] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [isVacateModalOpen, setIsVacateModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form states
  const [allocateData, setAllocateData] = useState({
    studentId: '',
    applicationId: '',
    roomId: '',
    remarks: '',
  });

  const [vacateData, setVacateData] = useState({
    vacateRemarks: 'End of academic term / Checkout',
  });

  const [reassignData, setReassignData] = useState({
    newRoomId: '',
    remarks: 'Room reassignment requested',
  });

  const { success, error: toastError } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch active & all allocations
      const [allocRes, appRes, roomRes] = await Promise.all([
        allocationService.getAll(),
        applicationService.getAll({ status: 'Approved' }),
        roomService.getAll({ status: 'Available' }),
      ]);

      if (allocRes.data.success) {
        setAllocations(allocRes.data.allocations);
      }
      if (appRes.data.success) {
        setApprovedApplications(appRes.data.applications);
      }
      if (roomRes.data.success) {
        setAvailableRooms(roomRes.data.rooms);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to load allocation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter allocations
  const activeAllocations = allocations.filter((a) => a.status === 'Active');
  const historyAllocations = allocations.filter((a) => a.status !== 'Active');

  // Filter by search
  const filteredActive = activeAllocations.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.student?.name?.toLowerCase().includes(term) ||
      a.student?.rollNumber?.toLowerCase().includes(term) ||
      a.room?.roomNumber?.toLowerCase().includes(term) ||
      a.hostel?.name?.toLowerCase().includes(term)
    );
  });

  const filteredHistory = historyAllocations.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.student?.name?.toLowerCase().includes(term) ||
      a.student?.rollNumber?.toLowerCase().includes(term) ||
      a.room?.roomNumber?.toLowerCase().includes(term) ||
      a.hostel?.name?.toLowerCase().includes(term)
    );
  });

  const filteredAwaiting = approvedApplications.filter((app) => {
    const term = searchTerm.toLowerCase();
    return (
      app.student?.name?.toLowerCase().includes(term) ||
      app.student?.rollNumber?.toLowerCase().includes(term) ||
      app.preferredHostel?.name?.toLowerCase().includes(term) ||
      app.applicationNumber?.toLowerCase().includes(term)
    );
  });

  // Open Allocate Modal directly for an approved application
  const handleOpenAllocateForApp = (app) => {
    setSelectedItem(app);
    setAllocateData({
      studentId: app.student?._id,
      applicationId: app._id,
      roomId: '',
      remarks: `Allocated based on application ${app.applicationNumber}`,
    });
    setFormError('');
    setIsAllocateModalOpen(true);
  };

  // Open Direct Allocate Modal
  const handleOpenDirectAllocate = () => {
    setSelectedItem(null);
    setAllocateData({
      studentId: '',
      applicationId: '',
      roomId: '',
      remarks: '',
    });
    setFormError('');
    setIsAllocateModalOpen(true);
  };

  // Submit Room Allocation
  const handleAllocateSubmit = async (e) => {
    e.preventDefault();
    if (!allocateData.studentId || !allocateData.roomId) {
      setFormError('Please select both a student and an available room.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');
      const res = await allocationService.create(allocateData);
      if (res.data.success) {
        success(res.data.message || 'Room allocated successfully!');
        setIsAllocateModalOpen(false);
        fetchData();
        setActiveTab('active');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to allocate room.';
      setFormError(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Vacate Modal
  const handleOpenVacate = (alloc) => {
    setSelectedItem(alloc);
    setVacateData({ vacateRemarks: 'End of semester / Student checkout' });
    setIsVacateModalOpen(true);
  };

  const handleVacateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await allocationService.vacate(selectedItem._id, vacateData);
      if (res.data.success) {
        success(res.data.message || 'Room vacated successfully!');
        setIsVacateModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to vacate room.');
    } finally {
      setSubmitting(false);
    }
  };

  // Reassign Modal
  const handleOpenReassign = (alloc) => {
    setSelectedItem(alloc);
    setReassignData({
      newRoomId: '',
      remarks: `Transfer requested from Room ${alloc.room?.roomNumber}`,
    });
    setIsReassignModalOpen(true);
  };

  const handleReassignSubmit = async (e) => {
    e.preventDefault();
    if (!reassignData.newRoomId) {
      toastError('Please choose the destination room.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await allocationService.reassign(selectedItem._id, reassignData);
      if (res.data.success) {
        success(res.data.message || 'Student reassigned successfully!');
        setIsReassignModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to reassign room.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c1429]/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-indigo-500/25 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-white">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <img src="/livora-logo.svg" alt="LIVORA" className="w-8 h-8 rounded-xl" />
            <span>Room Allocation Engine</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Assign rooms to verified students, handle room transfers, and record checkouts.
          </p>
        </div>
        <button
          onClick={handleOpenDirectAllocate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <KeyRound className="w-4 h-4" />
          <span>New Room Allocation</span>
        </button>
      </div>

      {/* Tabs & Search Navigation */}
      <div className="bg-[#0c1429]/90 backdrop-blur-xl p-4 rounded-3xl border border-indigo-500/25 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-1.5 p-1 bg-indigo-950/70 rounded-2xl w-full md:w-auto border border-indigo-800/50">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-indigo-900/50'
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Active Allocations</span>
            <span className="px-1.5 py-0.2 bg-blue-900/80 text-sky-200 rounded-full text-[10px] border border-blue-700/60">
              {activeAllocations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('awaiting')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'awaiting'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-indigo-900/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Awaiting Allocation</span>
            <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full text-[10px] border border-amber-500/30">
              {approvedApplications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-indigo-900/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Allocation History</span>
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, roll no, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#070e24] border border-indigo-800/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Tab 1: Active Allocations Table */}
      {activeTab === 'active' && (
        <div className="bg-[#0c1429]/90 backdrop-blur-xl rounded-3xl border border-indigo-500/25 shadow-xl overflow-hidden text-white">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={4} cols={5} />
            </div>
          ) : filteredActive.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#080f24] border-b border-indigo-950/90 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Student Details</th>
                    <th className="py-3.5 px-4">Hostel & Room</th>
                    <th className="py-3.5 px-4">Room Specs</th>
                    <th className="py-3.5 px-4">Allocation Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredActive.map((alloc) => (
                    <tr key={alloc._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{alloc.student?.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {alloc.student?.rollNumber} • {alloc.student?.course}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{alloc.hostel?.name}</div>
                        <div className="text-[11px] text-brand-600 font-bold">
                          Room {alloc.room?.roomNumber} (Floor {alloc.room?.floor})
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-700">{alloc.room?.roomType} Room</div>
                        <div className="text-[11px] text-slate-500">
                          ₹{alloc.monthlyFee?.toLocaleString()}/mo
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {new Date(alloc.allocationDate).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge status={alloc.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenReassign(alloc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-brand-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
                            title="Reassign to another room"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>Reassign</span>
                          </button>
                          <button
                            onClick={() => handleOpenVacate(alloc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium transition-colors"
                            title="Vacate room"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Vacate</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <DoorOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No Active Allocations Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No students currently occupy rooms matching this filter. Check the "Awaiting Allocation" tab to allocate approved students.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Awaiting Allocation (Approved Applications) */}
      {activeTab === 'awaiting' && (
        <div className="bg-[#0c1429]/90 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl overflow-hidden">
          {filteredAwaiting.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#070e24]/90 border-b border-indigo-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Application No.</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Preferences</th>
                    <th className="py-3.5 px-4">Approval Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/50 text-xs">
                  {filteredAwaiting.map((app) => (
                    <tr key={app._id} className="hover:bg-indigo-950/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-indigo-400">
                        {app.applicationNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{app.student?.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {app.student?.rollNumber} • {app.student?.gender} • {app.student?.course}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{app.preferredHostel?.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {app.roomType} Room (Prefers Floor {app.preferredFloor})
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={app.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenAllocateForApp(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-950/50 transition-all active:scale-95"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Assign Room</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">All Approved Applications Allocated!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                There are no approved applications waiting for room assignments right now.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Allocation History */}
      {activeTab === 'history' && (
        <div className="bg-[#0c1429]/90 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl overflow-hidden">
          {filteredHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#070e24]/90 border-b border-indigo-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Hostel & Room</th>
                    <th className="py-3.5 px-4">Allocation Term</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Checkout Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/50 text-xs">
                  {filteredHistory.map((alloc) => (
                    <tr key={alloc._id} className="hover:bg-indigo-950/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{alloc.student?.name}</div>
                        <div className="text-[11px] text-indigo-400 font-mono">
                          {alloc.student?.rollNumber}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{alloc.hostel?.name}</div>
                        <div className="text-[11px] text-slate-400">
                          Room {alloc.room?.roomNumber} ({alloc.room?.roomType})
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div>Allocated: {new Date(alloc.allocationDate).toLocaleDateString()}</div>
                        <div className="text-[11px] text-slate-400">
                          Vacated: {alloc.vacateDate ? new Date(alloc.vacateDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={alloc.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 italic">
                        {alloc.vacateRemarks || 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-indigo-400/50 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">No Past History Records</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No rooms have been vacated or transferred yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal: Allocate Room */}
      <Modal
        isOpen={isAllocateModalOpen}
        onClose={() => setIsAllocateModalOpen(false)}
        title="Allocate Hostel Room"
        subtitle="Assign a student to an available room"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleAllocateSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              {formError}
            </div>
          )}

          {/* Student Selection (if not pre-selected from application) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Approved Student *
            </label>
            {selectedItem ? (
              <div className="p-3 bg-[#070e24] border border-indigo-950 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">{selectedItem.student?.name}</span>
                  <span className="text-slate-400 ml-2">({selectedItem.student?.rollNumber})</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {selectedItem.student?.course} • Prefers {selectedItem.preferredHostel?.name} ({selectedItem.roomType})
                  </div>
                </div>
                <Badge status={selectedItem.status} />
              </div>
            ) : (
              <select
                name="studentId"
                required
                value={allocateData.studentId}
                onChange={(e) =>
                  setAllocateData((prev) => ({ ...prev, studentId: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                <option value="">-- Choose a student awaiting room --</option>
                {approvedApplications.map((app) => (
                  <option key={app.student?._id} value={app.student?._id}>
                    {app.student?.name} ({app.student?.rollNumber}) - {app.preferredHostel?.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Available Room with Remaining Capacity *
            </label>
            <select
              name="roomId"
              required
              value={allocateData.roomId}
              onChange={(e) =>
                setAllocateData((prev) => ({ ...prev, roomId: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            >
              <option value="">-- Select Available Room --</option>
              {availableRooms
                .filter((r) => r.currentOccupancy < r.capacity)
                .map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.hostel?.name} | Room {r.roomNumber} ({r.roomType}) - Floor {r.floor} | {r.capacity - r.currentOccupancy} bed(s) free | ₹{r.monthlyFee}/mo
                  </option>
                ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Only rooms with at least 1 free bed are shown. System strictly enforces room capacity limit.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Remarks / Notes</label>
            <input
              type="text"
              name="remarks"
              value={allocateData.remarks}
              onChange={(e) =>
                setAllocateData((prev) => ({ ...prev, remarks: e.target.value }))
              }
              placeholder="e.g. Bed 1 assigned. Documents verified."
              className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAllocateModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Allocating...' : 'Confirm Room Allocation'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Vacate Room */}
      <Modal
        isOpen={isVacateModalOpen}
        onClose={() => setIsVacateModalOpen(false)}
        title="Confirm Vacate Room"
      >
        <form onSubmit={handleVacateSubmit} className="space-y-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
            <p className="font-semibold">
              Vacate Room {selectedItem?.room?.roomNumber} for {selectedItem?.student?.name}?
            </p>
            <p className="mt-1 text-slate-300">
              The student will be removed from this room and the room's available bed count will be restored immediately.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Vacate Reason / Remarks</label>
            <textarea
              rows="2"
              required
              value={vacateData.vacateRemarks}
              onChange={(e) => setVacateData({ vacateRemarks: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsVacateModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Vacating...' : 'Confirm Vacate'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Reassign Room */}
      <Modal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        title="Reassign Student Room"
        subtitle={`Transfer ${selectedItem?.student?.name} from Room ${selectedItem?.room?.roomNumber}`}
      >
        <form onSubmit={handleReassignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select New Room with Vacancy *
            </label>
            <select
              required
              value={reassignData.newRoomId}
              onChange={(e) =>
                setReassignData((prev) => ({ ...prev, newRoomId: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            >
              <option value="">-- Choose Target Room --</option>
              {availableRooms
                .filter(
                  (r) =>
                    r._id !== selectedItem?.room?._id &&
                    r.currentOccupancy < r.capacity
                )
                .map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.hostel?.name} | Room {r.roomNumber} ({r.roomType}) - Floor {r.floor} | {r.capacity - r.currentOccupancy} bed(s) free | ₹{r.monthlyFee}/mo
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Transfer Remarks</label>
            <input
              type="text"
              value={reassignData.remarks}
              onChange={(e) =>
                setReassignData((prev) => ({ ...prev, remarks: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsReassignModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Reassigning...' : 'Confirm Room Transfer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomAllocation;
