import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BedDouble,
  DoorOpen,
  FileText,
  Clock,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Users,
  Calendar,
  Sparkles,
  Phone,
  ShieldAlert,
} from 'lucide-react';
import { dashboardService } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getRoomImage, getHostelImage } from '../../data/campusImages';

export const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStudent();
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load student dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading your hostel resident portal..." />;
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
          className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { student, allocation, roommates, latestApplication, availableRoomsCount, availableRoomsSample } =
    data;

  const hasActiveAllocation = Boolean(allocation && allocation.room);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-brand-800 to-slate-950 text-white p-7 sm:p-9 rounded-3xl shadow-xl shadow-indigo-900/25 relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-200 mb-3 border border-white/15 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-spin" />
            <span>LIVORA LIVING • Autonomous Scholar Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
            Welcome back, {student?.name}!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-indigo-100 max-w-xl font-medium">
            {student?.course} • Roll Number: <span className="font-mono font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-lg ml-1 border border-white/20">{student?.rollNumber}</span>
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
          <Building2 className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Main Grid: Allocation & Application Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Room Allocation Status Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0c1429]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-indigo-950/80">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shadow-md ${
                    hasActiveAllocation
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <DoorOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">Current Room Allotment</h2>
                  <p className="text-xs text-slate-400">Your campus residence status & credentials</p>
                </div>
              </div>
              <Badge status={hasActiveAllocation ? 'Active' : 'Not Allocated'} />
            </div>

            {hasActiveAllocation ? (
              <div className="mt-5 space-y-5">
                {/* Room Photo Preview */}
                <div className="relative h-44 rounded-2xl overflow-hidden border border-indigo-500/25">
                  <img
                    src={getRoomImage(allocation.room?.roomType)}
                    alt="Room Allotment"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1429] via-[#0c1429]/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-black text-white">
                        Room {allocation.room?.roomNumber} • {allocation.hostel?.name}
                      </p>
                      <p className="text-xs text-sky-300 font-medium">Floor {allocation.room?.floor} • {allocation.room?.roomType} Suite</p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-blue-600/80 text-white font-extrabold text-xs shadow-md">
                      ₹{allocation.monthlyFee?.toLocaleString()}/mo
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-indigo-950/50 p-3.5 rounded-2xl border border-indigo-900/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Hostel</p>
                    <p className="text-xs font-bold text-white mt-0.5">
                      {allocation.hostel?.name}
                    </p>
                    <p className="text-[10px] text-sky-300">{allocation.hostel?.type} Residence</p>
                  </div>

                  <div className="bg-indigo-950/50 p-3.5 rounded-2xl border border-indigo-900/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Room Number</p>
                    <p className="text-sm font-black text-sky-300 mt-0.5">
                      {allocation.room?.roomNumber}
                    </p>
                    <p className="text-[10px] text-slate-400">Floor {allocation.room?.floor}</p>
                  </div>

                  <div className="bg-indigo-950/50 p-3.5 rounded-2xl border border-indigo-900/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Room Type</p>
                    <p className="text-xs font-bold text-white mt-0.5">
                      {allocation.room?.roomType} Room
                    </p>
                    <p className="text-[10px] text-slate-400">{allocation.room?.capacity} Beds Total</p>
                  </div>

                  <div className="bg-indigo-950/50 p-3.5 rounded-2xl border border-indigo-900/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Monthly Fee</p>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">
                      ₹{allocation.monthlyFee?.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400">Per Month</p>
                  </div>
                </div>

                {/* Roommates Card */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    <span>Assigned Roommates ({roommates?.length || 0})</span>
                  </h3>

                  {roommates && roommates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {roommates.map((rm) => (
                        <div
                          key={rm._id}
                          className="flex items-center gap-3 p-3.5 bg-indigo-950/60 rounded-2xl border border-indigo-900/60"
                        >
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                            {rm.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{rm.name}</p>
                            <p className="text-[11px] text-slate-300 truncate font-mono">
                              {rm.rollNumber} • {rm.course}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic bg-indigo-950/40 p-3.5 rounded-2xl border border-indigo-900/50">
                      {allocation.room?.roomType === 'Single'
                        ? 'You are in a Single room with no roommates.'
                        : 'No other roommates currently assigned to this room.'}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    to="/student/my-room"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-950 hover:bg-blue-600 text-sky-300 hover:text-white border border-indigo-800/60 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <span>View Complete Room Details & Amenities</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <DoorOpen className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No Active Room Allocation</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You currently have no room allocated. If you haven't applied yet, submit an application below to secure accommodation.
                </p>
                <div>
                  <Link
                    to="/student/apply"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
                  >
                    <BedDouble className="w-4 h-4" />
                    <span>Apply for Hostel Now</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Available Rooms Overview */}
          <div className="bg-[#0c1429]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-white">Campus Residence Vacancies</h3>
                <p className="text-xs text-slate-400">
                  {availableRoomsCount} available rooms currently open for allocation
                </p>
              </div>
              <Link
                to="/student/apply"
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <span>Apply to Hostel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableRoomsSample && availableRoomsSample.length > 0 ? (
                availableRoomsSample.map((room) => (
                  <div
                    key={room._id}
                    className="p-3.5 bg-indigo-950/50 hover:bg-indigo-900/60 rounded-2xl border border-indigo-900/60 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Room {room.roomNumber}</span>
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                        {room.capacity - room.currentOccupancy} free
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 truncate">
                      {room.hostel?.name}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-indigo-900/60">
                      <span>{room.roomType} Room</span>
                      <span className="font-bold text-sky-300">₹{room.monthlyFee}/mo</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-xs text-slate-400">
                  No vacant rooms available at the moment.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Application Status & Student Profile Card */}
        <div className="space-y-6">
          {/* Application Status Card */}
          <div className="bg-[#0c1429]/90 backdrop-blur-xl rounded-3xl p-6 border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-white">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-950/80 mb-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Application Status</span>
              </h3>
              {latestApplication && <Badge status={latestApplication.status} />}
            </div>

            {latestApplication ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Application No.</span>
                  <p className="font-mono font-bold text-sky-300 text-sm mt-0.5">
                    {latestApplication.applicationNumber}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Requested Hostel</span>
                  <p className="font-bold text-white mt-0.5">
                    {latestApplication.preferredHostel?.name}
                  </p>
                  <p className="text-slate-300 text-[11px]">
                    {latestApplication.roomType} Room • Floor {latestApplication.preferredFloor}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Applied On</span>
                  <p className="text-slate-200 mt-0.5">
                    {new Date(latestApplication.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {latestApplication.adminRemarks && (
                  <div className="p-3 bg-indigo-950/60 rounded-2xl border border-indigo-900/60 text-slate-200">
                    <span className="text-[10px] font-bold text-sky-400 uppercase block mb-1">
                      Warden Remarks
                    </span>
                    <p className="italic">{latestApplication.adminRemarks}</p>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    to="/student/applications"
                    className="block text-center py-2.5 px-3 bg-indigo-950 hover:bg-blue-600 text-sky-200 hover:text-white font-bold rounded-2xl border border-indigo-800/60 transition-all shadow-sm"
                  >
                    View All Applications
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <Clock className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">No application submitted yet.</p>
                <Link
                  to="/student/apply"
                  className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Apply Now
                </Link>
              </div>
            )}
          </div>

          {/* Student Profile Quick View */}
          <div className="bg-[#0c1429]/90 backdrop-blur-xl rounded-3xl p-6 border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] space-y-3.5 text-xs text-white">
            <h3 className="text-sm font-black text-white pb-2 border-b border-indigo-950/80 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" />
              <span>Student Profile</span>
            </h3>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold">Full Name</span>
              <p className="font-bold text-white text-sm">{student?.name}</p>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold">Email Address</span>
              <p className="text-slate-300 font-mono">{student?.email}</p>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold">Contact Number</span>
              <p className="text-slate-300 font-mono">{student?.phoneNumber || 'Not provided'}</p>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold">Gender</span>
              <p className="text-slate-300">{student?.gender}</p>
            </div>

            <div className="pt-2">
              <Link
                to="/student/profile"
                className="block text-center py-2.5 px-3 bg-indigo-950/80 hover:bg-blue-600 text-sky-300 hover:text-white border border-indigo-800/60 rounded-2xl font-bold transition-all shadow-sm"
              >
                Update Profile & Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
