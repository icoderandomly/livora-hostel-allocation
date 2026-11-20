import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  DoorOpen,
  CheckCircle2,
  Clock,
  KeyRound,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Plus,
  FileSpreadsheet,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { dashboardService } from '../../services/api';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getAdmin();
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading campus analytics & statistics..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          <span className="text-sm font-medium">{error}</span>
        </div>
        <button
          onClick={fetchDashboard}
          className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, hostelBreakdown, applicationStatusData, recentApplications, recentAllocations } = data;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0c1429]/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-indigo-500/25 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-indigo-950/80 text-sky-300 font-extrabold text-[10px] uppercase tracking-wider border border-indigo-700/60 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              CAMPUS EXECUTIVE SUITE
            </span>
            <span className="text-xs text-slate-400 font-medium font-mono">Academic Term 2025–26</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5 font-sans">
            <img src="/livora-logo.svg" alt="LIVORA" className="w-8 h-8 rounded-xl" />
            <span>LIVORA</span>
            <span className="text-slate-500 font-light">|</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 font-black">
              Executive Command Center
            </span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time residential occupancy, room inventory analytics, and automated allocation pipelines.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <Link
            to="/admin/allocations"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <KeyRound className="w-4 h-4" />
            <span>Allocation Engine</span>
          </Link>
          <Link
            to="/admin/rooms"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-950/70 hover:bg-indigo-900 text-sky-200 hover:text-white border border-indigo-700/60 rounded-2xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Room</span>
          </Link>
          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-950/70 hover:bg-indigo-900 text-sky-200 hover:text-white border border-indigo-700/60 rounded-2xl text-xs font-bold transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Reports & CSV</span>
          </Link>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Registered on portal"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Hostels"
          value={stats.totalHostels}
          subtitle="Active campus residences"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          subtitle={`${stats.totalBedCapacity} total bed capacity`}
          icon={DoorOpen}
          color="purple"
        />
        <StatCard
          title="Available Rooms"
          value={stats.availableRooms}
          subtitle={`${stats.availableBeds} beds vacant`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Occupied Rooms"
          value={stats.occupiedRooms}
          subtitle={`${stats.overallOccupancyRate}% occupancy rate`}
          icon={TrendingUp}
          color="rose"
        />
        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications}
          subtitle="Require warden review"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Graphical Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hostel Capacity vs Occupancy Bar Chart */}
        <div className="lg:col-span-2 bg-[#0c1429]/90 backdrop-blur-xl p-6 rounded-3xl border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Hostel Capacity & Occupancy Breakdown
              </h2>
              <p className="text-xs text-slate-400">Total beds versus currently allocated beds</p>
            </div>
            <Link
              to="/admin/hostels"
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 group"
            >
              <span>Manage Hostels</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="h-72 w-full">
            {hostelBreakdown && hostelBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hostelBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070e24',
                      borderRadius: '16px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                      fontSize: '12px',
                      color: '#ffffff',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="capacity" name="Total Capacity (Beds)" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="occupied" name="Occupied Beds" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No hostel data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Application Status Donut Chart */}
        <div className="bg-[#0c1429]/90 backdrop-blur-xl p-6 rounded-3xl border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Application Pipeline
              </h2>
              <Link
                to="/admin/applications"
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 group"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <p className="text-xs text-slate-400 mb-4">Distribution of all student submissions</p>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={applicationStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {applicationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070e24',
                      borderRadius: '16px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      fontSize: '12px',
                      color: '#ffffff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-indigo-950/80">
            {applicationStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 font-medium">{item.name}:</span>
                <span className="font-bold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Submissions & Allocations Tables (Royal Blue Styled) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-[#0c1429]/90 backdrop-blur-xl rounded-3xl border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden text-white">
          <div className="p-5 border-b border-indigo-950/80 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">Recent Applications</h3>
            <Link
              to="/admin/applications"
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>Manage Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-indigo-950/70 overflow-x-auto">
            {recentApplications && recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div key={app._id} className="p-4 flex items-center justify-between gap-4 hover:bg-indigo-950/40 transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white truncate">
                        {app.student?.name || 'Unknown Student'}
                      </p>
                      <span className="text-[10px] text-sky-300 font-mono font-semibold">
                        ({app.student?.rollNumber || 'No Roll'})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                      {app.preferredHostel?.name} • {app.roomType} Room
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge status={app.status} />
                    <Link
                      to="/admin/applications"
                      className="p-2 text-sky-400 hover:text-white rounded-xl bg-indigo-950/80 hover:bg-blue-600 border border-indigo-800/60 transition-all"
                      title="Review Application"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                No recent applications found.
              </div>
            )}
          </div>
        </div>

        {/* Recent Room Allocations */}
        <div className="bg-[#0c1429]/90 backdrop-blur-xl rounded-3xl border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden text-white">
          <div className="p-5 border-b border-indigo-950/80 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">Recent Room Allocations</h3>
            <Link
              to="/admin/allocations"
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>All Allocations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-indigo-950/70 overflow-x-auto">
            {recentAllocations && recentAllocations.length > 0 ? (
              recentAllocations.map((alloc) => (
                <div key={alloc._id} className="p-4 flex items-center justify-between gap-4 hover:bg-indigo-950/40 transition-colors">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {alloc.student?.name}
                    </p>
                    <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                      {alloc.hostel?.name} • Room <span className="font-bold text-sky-300">{alloc.room?.roomNumber}</span> ({alloc.room?.roomType})
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 flex items-center gap-3">
                    <div>
                      <Badge status={alloc.status} />
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(alloc.allocationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      to="/admin/allocations"
                      className="p-2 text-sky-400 hover:text-white rounded-xl bg-indigo-950/80 hover:bg-blue-600 border border-indigo-800/60 transition-all"
                      title="View Allocation Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                No active allocations yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
