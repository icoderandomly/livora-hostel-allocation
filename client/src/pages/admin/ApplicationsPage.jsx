import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  KeyRound,
  User,
  Building2,
  Calendar,
  AlertCircle,
  CheckCheck,
} from 'lucide-react';
import { applicationService } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { TableSkeleton } from '../../components/common/LoadingSpinner';
import { useToast } from '../../components/common/Toast';

export const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Review Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getAll({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        search: searchTerm || undefined,
      });
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, searchTerm]);

  const handleOpenReview = (app) => {
    setSelectedApp(app);
    setAdminRemarks(app.adminRemarks || '');
    setIsReviewModalOpen(true);
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setSubmitting(true);
      const res = await applicationService.updateStatus(selectedApp._id, {
        status: newStatus,
        adminRemarks,
      });
      if (res.data.success) {
        success(`Application marked as ${newStatus}!`);
        setIsReviewModalOpen(false);
        fetchApplications();
      }
    } catch (err) {
      toastError(err.response?.data?.message || `Failed to update status to ${newStatus}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#0c1429]/90 p-6 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            Hostel Application Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review student room accommodation requests, verify emergency contacts, and approve or reject submissions.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-[#0c1429]/90 p-4 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#070e24] border border-indigo-950/80 rounded-2xl w-full md:w-auto">
          {['All', 'Pending', 'Approved', 'Allocated', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-950/60'
                  : 'text-slate-400 hover:text-white hover:bg-indigo-950/40'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, roll no, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-[#0c1429]/90 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={6} />
          </div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#070e24]/90 border-b border-indigo-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Application ID</th>
                  <th className="py-3.5 px-4">Student Profile</th>
                  <th className="py-3.5 px-4">Course & Roll</th>
                  <th className="py-3.5 px-4">Requested Room</th>
                  <th className="py-3.5 px-4">Submission Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/50 text-xs">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-indigo-950/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                      {app.applicationNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{app.student?.name}</div>
                      <div className="text-[11px] text-slate-400">{app.student?.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{app.student?.rollNumber}</div>
                      <div className="text-[11px] text-slate-400">
                        {app.student?.course} ({app.student?.year})
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{app.preferredHostel?.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {app.roomType} Room (Floor {app.preferredFloor})
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge status={app.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenReview(app)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#070e24] hover:bg-indigo-900/40 text-slate-200 hover:text-white border border-indigo-950/80 hover:border-indigo-500/40 rounded-xl text-xs font-semibold transition-all active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-indigo-400/50 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">No Applications Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No hostel applications match your current filter settings.
            </p>
          </div>
        )}
      </div>

      {/* Review Application Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Application Review & Decision"
        subtitle={`Application ${selectedApp?.applicationNumber}`}
        maxWidth="max-w-2xl"
      >
        {selectedApp && (
          <div className="space-y-5">
            {/* Student & Request Summary */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#070e24] rounded-2xl border border-indigo-950/80 text-xs">
              <div>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Applicant Name</p>
                <p className="font-bold text-white mt-0.5">{selectedApp.student?.name}</p>
                <p className="text-slate-400 mt-0.5">{selectedApp.student?.email}</p>
                <p className="text-slate-400">{selectedApp.student?.phoneNumber}</p>
              </div>

              <div>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Academic Info</p>
                <p className="font-semibold text-slate-200 mt-0.5">
                  Roll No: {selectedApp.student?.rollNumber}
                </p>
                <p className="text-slate-400 mt-0.5">{selectedApp.student?.course}</p>
                <p className="text-slate-400">{selectedApp.student?.year} • {selectedApp.student?.gender}</p>
              </div>

              <div className="pt-2 border-t border-indigo-950 col-span-2 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Requested Hostel</p>
                  <p className="font-semibold text-slate-200 mt-0.5">
                    {selectedApp.preferredHostel?.name}
                  </p>
                  <p className="text-slate-400">
                    {selectedApp.roomType} Room • Floor {selectedApp.preferredFloor}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Emergency Contact</p>
                  <p className="font-medium text-slate-200 mt-0.5">
                    {selectedApp.personalDetails?.emergencyContactName || 'N/A'}
                  </p>
                  <p className="text-slate-400">
                    Phone: {selectedApp.personalDetails?.emergencyContactPhone || 'N/A'}
                  </p>
                  <p className="text-slate-400">
                    Blood Group: {selectedApp.personalDetails?.bloodGroup || 'N/A'}
                  </p>
                </div>
              </div>

              {selectedApp.personalDetails?.specialRequests && (
                <div className="col-span-2 pt-2 border-t border-indigo-950">
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Special Requests / Reason</p>
                  <p className="text-slate-300 italic mt-0.5">
                    "{selectedApp.personalDetails.specialRequests}"
                  </p>
                </div>
              )}
            </div>

            {/* Current Status Pill */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-semibold text-slate-300">Current Application Status:</span>
              <Badge status={selectedApp.status} />
            </div>

            {/* Admin Remarks Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin / Warden Remarks
              </label>
              <textarea
                rows="2"
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Enter remarks for student (e.g. Approved, ready for allocation; or reason for rejection)"
                className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-indigo-950 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {/* Reject Button */}
                <button
                  type="button"
                  disabled={submitting || selectedApp.status === 'Allocated'}
                  onClick={() => handleUpdateStatus('Rejected')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl disabled:opacity-40 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Reject</span>
                </button>

                {/* Approve Button */}
                <button
                  type="button"
                  disabled={submitting || selectedApp.status === 'Allocated'}
                  onClick={() => handleUpdateStatus('Approved')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md disabled:opacity-40 transition-all active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Application</span>
                </button>

                {/* Allocate Room Button shortcut if approved */}
                {selectedApp.status === 'Approved' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsReviewModalOpen(false);
                      navigate('/admin/allocations');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Proceed to Allocate Room</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApplicationsPage;
