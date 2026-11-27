import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  BedDouble,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { applicationService } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/LoadingSpinner';
import { useToast } from '../../components/common/Toast';

export const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error: toastError } = useToast();

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getMy();
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to load your applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div>
          <h1 className="text-xl font-extrabold text-stone-100 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <FileText className="w-5 h-5" />
            </span>
            My Hostel Applications
          </h1>
          <p className="text-xs text-stone-400 mt-1.5">
            Track submission timelines, warden inspection remarks, and room allocation statuses.
          </p>
        </div>
        <Link
          to="/student/apply"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-stone-950 rounded-2xl text-xs font-black shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <BedDouble className="w-4 h-4" />
          <span>New Application</span>
        </Link>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {loading ? (
          <TableSkeleton rows={3} cols={4} />
        ) : applications.length > 0 ? (
          applications.map((app) => (
            <div
              key={app._id}
              className="glass-card glass-card-hover rounded-3xl p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800/90">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-100 font-mono">
                        {app.applicationNumber}
                      </h3>
                      <Badge status={app.status} />
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Submitted on {new Date(app.createdAt).toLocaleDateString()} at{' '}
                      {new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {app.status === 'Allocated' && (
                  <Link
                    to="/student/my-room"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/35 rounded-xl text-xs font-bold transition-colors"
                  >
                    <span>View Allocated Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* Application Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Preferred Hostel</span>
                  <p className="font-semibold text-stone-100 mt-0.5">{app.preferredHostel?.name}</p>
                  <p className="text-stone-400 text-[11px]">{app.preferredHostel?.location}</p>
                </div>

                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Room Category</span>
                  <p className="font-semibold text-stone-100 mt-0.5">{app.roomType} Room</p>
                  <p className="text-stone-400 text-[11px]">Floor {app.preferredFloor} preferred</p>
                </div>

                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Emergency Contact</span>
                  <p className="font-medium text-stone-200 mt-0.5">
                    {app.personalDetails?.emergencyContactName || 'None'}
                  </p>
                  <p className="text-stone-400 text-[11px]">
                    {app.personalDetails?.emergencyContactPhone}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Review Date</span>
                  <p className="text-stone-200 mt-0.5 font-medium">
                    {app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString() : 'Pending'}
                  </p>
                  {app.reviewedBy && (
                    <p className="text-stone-400 text-[11px]">By {app.reviewedBy.name}</p>
                  )}
                </div>
              </div>

              {/* Admin Remarks Box */}
              {app.adminRemarks ? (
                <div
                  className={`mt-2 p-3.5 rounded-2xl border text-xs ${
                    app.status === 'Approved' || app.status === 'Allocated'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : app.status === 'Rejected'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                      : 'bg-[#0b0a08] border-stone-800 text-stone-300'
                  }`}
                >
                  <p className="font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Warden / Admin Remarks</span>
                  </p>
                  <p>{app.adminRemarks}</p>
                </div>
              ) : (
                <div className="mt-2 p-3 bg-[#0b0a08] rounded-2xl border border-stone-800/80 text-xs text-stone-400 italic">
                  No additional remarks from administration yet.
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="glass-panel p-12 text-center rounded-3xl">
            <FileText className="w-12 h-12 text-amber-400/50 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-stone-100">No Applications Filed Yet</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto mb-4">
              You haven&apos;t submitted any hostel accommodation applications yet.
            </p>
            <Link
              to="/student/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-stone-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <BedDouble className="w-4 h-4" />
              <span>Apply for Room</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
