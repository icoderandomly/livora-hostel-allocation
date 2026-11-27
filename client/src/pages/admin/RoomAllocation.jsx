import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  DoorOpen,
  Calendar,
  ArrowRightLeft,
  LogOut,
  Search,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { allocationService, roomService, applicationService } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { TableSkeleton } from '../../components/common/LoadingSpinner';
import { useToast } from '../../components/common/Toast';

export const RoomAllocation = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [allocations, setAllocations] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');

  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [isVacateModalOpen, setIsVacateModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

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

  const activeAllocations = allocations.filter((a) => a.status === 'Active');
  const historyAllocations = allocations.filter((a) => a.status !== 'Active');

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
      <div className="glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl text-white">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <img src="/livora-logo.svg" alt="LIVORA" className="w-8 h-8 rounded-xl" />
            <span>Room Allocation Engine</span>
          </h1>
          <p className="text-xs text-stone-300 mt-1">
            Assign rooms to verified students, handle room transfers, and record checkouts.
          </p>
        </div>
        <button
          onClick={handleOpenDirectAllocate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-stone-950 rounded-2xl text-xs font-black shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.03] active:scale-[0.98]"
        >
          <KeyRound className="w-4 h-4" />
          <span>New Room Allocation</span>
        </button>
      </div>

      {/* Tabs & Search Navigation */}
      <div className="glass-card p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 text-white">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0b0a08] rounded-2xl w-full md:w-auto border border-stone-800">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-amber-200 hover:bg-stone-900'
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Active Allocations</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] border ${
                activeTab === 'active'
                  ? 'bg-stone-950/15 text-stone-950 border-stone-950/25'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}
            >
              {activeAllocations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('awaiting')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'awaiting'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-amber-200 hover:bg-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Awaiting Allocation</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] border ${
                activeTab === 'awaiting'
                  ? 'bg-stone-950/15 text-stone-950 border-stone-950/25'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {approvedApplications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:text-amber-200 hover:bg-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Allocation History</span>
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-amber-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, roll no, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#0b0a08] border border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400 text-white placeholder-stone-500"
          />
        </div>
      </div>

      {/* Tab 1: Active Allocations Table */}
      {activeTab === 'active' && (
        <div className="glass-card rounded-3xl overflow-hidden text-white">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={4} cols={5} />
            </div>
          ) : filteredActive.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0b0a08]/95 border-b border-stone-800 text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Student Details</th>
                    <th className="py-3.5 px-4">Hostel &amp; Room</th>
                    <th className="py-3.5 px-4">Room Specs</th>
                    <th className="py-3.5 px-4">Allocation Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/70 text-xs">
                  {filteredActive.map((alloc) => (
                    <tr key={alloc._id} className="hover:bg-amber-500/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{alloc.student?.name}</div>
                        <div className="text-[11px] text-stone-400 font-mono">
                          {alloc.student?.rollNumber} • {alloc.student?.course}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-100">{alloc.hostel?.name}</div>
                        <div className="text-[11px] text-amber-400 font-bold">
                          Room {alloc.room?.roomNumber} (Floor {alloc.room?.floor})
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-200">{alloc.room?.roomType} Room</div>
                        <div className="text-[11px] text-stone-400">
                          ₹{alloc.monthlyFee?.toLocaleString()}/mo
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-300">
                        {new Date(alloc.allocationDate).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge status={alloc.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenReassign(alloc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-stone-200 hover:text-amber-300 hover:bg-amber-500/15 border border-stone-700 hover:border-amber-500/40 rounded-lg text-xs font-medium transition-colors"
                            title="Reassign to another room"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>Reassign</span>
                          </button>
                          <button
                            onClick={() => handleOpenVacate(alloc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-400 hover:text-white hover:bg-rose-600 border border-rose-500/30 rounded-lg text-xs font-medium transition-colors"
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
              <DoorOpen className="w-12 h-12 text-amber-400/40 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">No Active Allocations Found</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                No students currently occupy rooms matching this filter. Check the "Awaiting Allocation" tab to allocate approved students.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Awaiting Allocation */}
      {activeTab === 'awaiting' && (
        <div className="glass-card rounded-3xl overflow-hidden">
          {filteredAwaiting.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0b0a08]/95 border-b border-stone-800 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Application No.</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Preferences</th>
                    <th className="py-3.5 px-4">Approval Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/70 text-xs">
                  {filteredAwaiting.map((app) => (
                    <tr key={app._id} className="hover:bg-amber-500/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-amber-400">
                        {app.applicationNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{app.student?.name}</div>
                        <div className="text-[11px] text-stone-400">
                          {app.student?.rollNumber} • {app.student?.gender} • {app.student?.course}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-200">{app.preferredHostel?.name}</div>
                        <div className="text-[11px] text-stone-400">
                          {app.roomType} Room (Prefers Floor {app.preferredFloor})
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-300">
                        {app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={app.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenAllocateForApp(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
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
              <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                There are no approved applications waiting for room assignments right now.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Allocation History */}
      {activeTab === 'history' && (
        <div className="glass-card rounded-3xl overflow-hidden">
          {filteredHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0b0a08]/95 border-b border-stone-800 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Hostel &amp; Room</th>
                    <th className="py-3.5 px-4">Allocation Term</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Checkout Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/70 text-xs">
                  {filteredHistory.map((alloc) => (
                    <tr key={alloc._id} className="hover:bg-amber-500/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{alloc.student?.name}</div>
                        <div className="text-[11px] text-amber-400 font-mono">
                          {alloc.student?.rollNumber}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-200">{alloc.hostel?.name}</div>
                        <div className="text-[11px] text-stone-400">
                          Room {alloc.room?.roomNumber} ({alloc.room?.roomType})
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-300">
                        <div>Allocated: {new Date(alloc.allocationDate).toLocaleDateString()}</div>
                        <div className="text-[11px] text-stone-400">
                          Vacated: {alloc.vacateDate ? new Date(alloc.vacateDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={alloc.status} />
                      </td>
                      <td className="py-3.5 px-4 text-stone-400 italic">
                        {alloc.vacateRemarks || 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-amber-400/40 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">No Past History Records</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
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

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Select Approved Student *
            </label>
            {selectedItem ? (
              <div className="p-3 bg-[#0b0a08] border border-stone-800 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">{selectedItem.student?.name}</span>
                  <span className="text-stone-400 ml-2">({selectedItem.student?.rollNumber})</span>
                  <div className="text-[11px] text-stone-400 mt-0.5">
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
                className="w-full px-3 py-2 text-xs bg-[#0b0a08] border border-stone-800 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400"
              >
                <option value="" className="bg-[#12100e]">-- Choose a student awaiting room --</option>
                {approvedApplications.map((app) => (
                  <option key={app.student?._id} value={app.student?._id} className="bg-[#12100e]">
                    {app.student?.name} ({app.student?.rollNumber}) - {app.preferredHostel?.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Select Available Room with Remaining Capacity *
            </label>
            <select
              name="roomId"
              required
              value={allocateData.roomId}
              onChange={(e) =>
                setAllocateData((prev) => ({ ...prev, roomId: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs bg-[#0b0a08] border border-stone-800 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400"
            >
              <option value="" className="bg-[#12100e]">-- Select Available Room --</option>
              {availableRooms
                .filter((r) => r.currentOccupancy < r.capacity)
                .map((r) => (
                  <option key={r._id} value={r._id} className="bg-[#12100e]">
                    {r.hostel?.name} | Room {r.roomNumber} ({r.roomType}) - Floor {r.floor} | {r.capacity - r.currentOccupancy} bed(s) free | ₹{r.monthlyFee}/mo
                  </option>
                ))}
            </select>
            <p className="text-[11px] text-stone-400 mt-1">
              Only rooms with at least 1 free bed are shown. System strictly enforces room capacity limit.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Admin Remarks / Notes</label>
            <input
              type="text"
              name="remarks"
              value={allocateData.remarks}
              onChange={(e) =>
                setAllocateData((prev) => ({ ...prev, remarks: e.target.value }))
              }
              placeholder="e.g. Bed 1 assigned. Documents verified."
              className="w-full px-3 py-2 text-xs bg-[#0b0a08] border border-stone-800 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAllocateModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-black text-stone-950 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
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
            <p className="mt-1 text-stone-300">
              The student will be removed from this room and the room's available bed count will be restored immediately.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Vacate Reason / Remarks</label>
            <textarea
              rows="2"
              required
              value={vacateData.vacateRemarks}
              onChange={(e) => setVacateData({ vacateRemarks: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#0b0a08] border border-stone-800 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsVacateModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors"
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
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Select New Room with Vacancy *
            </label>
            <select
              required
              value={reassignData.newRoomId}
              onChange={(e) =>
                setReassignData((prev) => ({ ...prev, newRoomId: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs bg-[#0b0a08] border border-stone-800 rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400"
            >
              <option value="" className="bg-[#12100e]">-- Choose Target Room --</option>
              {availableRooms
                .filter(
                  (r) =>
                    r._id !== selectedItem?.room?._id &&
                    r.currentOccupancy < r.capacity
                )
                .map((r) => (
                  <option key={r._id} value={r._id} className="bg-[#12100e]">
                    {r.hostel?.name} | Room {r.roomNumber} ({r.roomType}) - Floor {r.floor} | {r.capacity - r.currentOccupancy} bed(s) free | ₹{r.monthlyFee}/mo
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Transfer Remarks</label>
            <input
              type="text"
              value={reassignData.remarks}
              onChange={(e) =>
                setReassignData((prev) => ({ ...prev, remarks: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs bg-[#0b0a08] border border-stone-800 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsReassignModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-black text-stone-950 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
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
