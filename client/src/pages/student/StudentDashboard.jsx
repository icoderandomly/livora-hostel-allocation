import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BedDouble,
  DoorOpen,
  FileText,
  Clock,
  User,
  Building2,
  AlertCircle,
  ArrowRight,
  Users,
  Sparkles,
} from 'lucide-react';
import { dashboardService } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getRoomImage } from '../../data/campusImages';

export const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
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
      <div className="p-6 bg-rose-950/60 border border-rose-500/30 rounded-3xl text-rose-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span className="text-sm font-medium">{error}</span>
        </div>
        <button
          onClick={fetchDashboard}
          className="px-4 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-500 transition-colors"
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
    <div className="space-y-6 animate-fade-up">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#1b150e] via-[#12100e] to-[#090807] text-stone-100 p-7 sm:p-9 rounded-3xl shadow-2xl shadow-black/50 relative overflow-hidden border border-amber-500/25">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 mb-3 border border-amber-500/25 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>LIVORA LIVING • Autonomous Scholar Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-stone-100">
            Welcome back, {student?.name}!
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-300 max-w-xl font-medium">
            {student?.course} • Roll Number:{' '}
            <span className="font-mono font-bold text-amber-200 bg-amber-500/15 px-2.5 py-0.5 rounded-lg ml-1 border border-amber-500/30">
              {student?.rollNumber}
            </span>
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
          <Building2 className="w-64 h-64 text-amber-400" />
        </div>
      </div>

      {/* Main Grid: Allocation & Application Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Room Allocation Status Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 text-stone-100">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800/90">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shadow-md ${
                    hasActiveAllocation
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <DoorOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-stone-100">Current Room Allotment</h2>
                  <p className="text-xs text-stone-400">Your campus residence status &amp; credentials</p>
                </div>
              </div>
              <Badge status={hasActiveAllocation ? 'Active' : 'Not Allocated'} />
            </div>

            {hasActiveAllocation ? (
              <div className="mt-5 space-y-5">
                {/* Room Photo Preview */}
                <div className="relative h-44 rounded-2xl overflow-hidden border border-amber-500/25">
                  <img
                    src={getRoomImage(allocation.room?.roomType)}
                    alt="Room Allotment"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12100e] via-[#12100e]/45 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-black text-stone-100">
                        Room {allocation.room?.roomNumber} • {allocation.hostel?.name}
                      </p>
                      <p className="text-xs text-amber-300 font-semibold">
                        Floor {allocation.room?.floor} • {allocation.room?.roomType} Suite
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/25">
                      ₹{allocation.monthlyFee?.toLocaleString()}/mo
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#0b0a08] p-3.5 rounded-2xl border border-stone-800/90 hover:border-amber-500/25 transition-colors">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Hostel</p>
                    <p className="text-xs font-bold text-stone-100 mt-0.5">
                      {allocation.hostel?.name}
                    </p>
                    <p className="text-[10px] text-amber-400">{allocation.hostel?.type} Residence</p>
                  </div>

                  <div className="bg-[#0b0a08] p-3.5 rounded-2xl border border-stone-800/90 hover:border-amber-500/25 transition-colors">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Room Number</p>
                    <p className="text-sm font-black text-amber-300 mt-0.5">
                      {allocation.room?.roomNumber}
                    </p>
                    <p className="text-[10px] text-stone-400">Floor {allocation.room?.floor}</p>
                  </div>

                  <div className="bg-[#0b0a08] p-3.5 rounded-2xl border border-stone-800/90 hover:border-amber-500/25 transition-colors">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Room Type</p>
                    <p className="text-xs font-bold text-stone-100 mt-0.5">
                      {allocation.room?.roomType} Room
                    </p>
                    <p className="text-[10px] text-stone-400">{allocation.room?.capacity} Beds Total</p>
                  </div>

                  <div className="bg-[#0b0a08] p-3.5 rounded-2xl border border-stone-800/90 hover:border-amber-500/25 transition-colors">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Monthly Fee</p>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">
                      ₹{allocation.monthlyFee?.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-stone-400">Per Month</p>
                  </div>
                </div>

                {/* Roommates Card */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-stone-100 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>Assigned Roommates ({roommates?.length || 0})</span>
                  </h3>

                  {roommates && roommates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {roommates.map((rm) => (
                        <div
                          key={rm._id}
                          className="flex items-center gap-3 p-3.5 bg-[#0b0a08] rounded-2xl border border-stone-800/90 hover:border-amber-500/25 transition-colors"
                        >
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-black text-xs shadow-lg shadow-amber-500/20">
                            {rm.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-stone-100 truncate">{rm.name}</p>
                            <p className="text-[11px] text-stone-400 truncate font-mono">
                              {rm.rollNumber} • {rm.course}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400 italic bg-[#0b0a08] p-3.5 rounded-2xl border border-stone-800/90">
                      {allocation.room?.roomType === 'Single'
                        ? 'You are in a Single room with no roommates.'
                        : 'No other roommates currently assigned to this room.'}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    to="/student/my-room"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900/80 hover:bg-amber-500/15 text-amber-300 hover:text-amber-200 border border-amber-500/30 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <span>View Complete Room Details &amp; Amenities</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <DoorOpen className="w-12 h-12 text-amber-400/50 mx-auto" />
                <h3 className="text-base font-bold text-stone-100">No Active Room Allocation</h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                  You currently have no room allocated. If you haven&apos;t applied yet, submit an application below to secure accommodation.
                </p>
                <div className="pt-1">
                  <Link
                    to="/student/apply"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-stone-950 rounded-2xl text-xs font-black shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <BedDouble className="w-4 h-4" />
                    <span>Apply for Hostel Now</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Available Rooms Overview */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 text-stone-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-stone-100">Campus Residence Vacancies</h3>
                <p className="text-xs text-stone-400">
                  {availableRoomsCount} available rooms currently open for allocation
                </p>
              </div>
              <Link
                to="/student/apply"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
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
                    className="p-3.5 bg-[#0b0a08] hover:bg-amber-500/10 rounded-2xl border border-stone-800/90 hover:border-amber-500/35 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-100">Room {room.roomNumber}</span>
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                        {room.capacity - room.currentOccupancy} free
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-300 mt-1 truncate">
                      {room.hostel?.name}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-stone-400 mt-2 pt-2 border-t border-stone-800/90">
                      <span>{room.roomType} Room</span>
                      <span className="font-bold text-amber-300">₹{room.monthlyFee}/mo</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-xs text-stone-400">
                  No vacant rooms available at the moment.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Application Status & Student Profile Card */}
        <div className="space-y-6">
          {/* Application Status Card */}
          <div className="glass-panel rounded-3xl p-6 text-stone-100">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800/90 mb-4">
              <h3 className="text-sm font-black text-stone-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Application Status</span>
              </h3>
              {latestApplication && <Badge status={latestApplication.status} />}
            </div>

            {latestApplication ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">Application No.</span>
                  <p className="font-mono font-bold text-amber-300 text-sm mt-0.5">
                    {latestApplication.applicationNumber}
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">Requested Hostel</span>
                  <p className="font-bold text-stone-100 mt-0.5">
                    {latestApplication.preferredHostel?.name}
                  </p>
                  <p className="text-stone-300 text-[11px]">
                    {latestApplication.roomType} Room • Floor {latestApplication.preferredFloor}
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">Applied On</span>
                  <p className="text-stone-200 mt-0.5">
                    {new Date(latestApplication.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {latestApplication.adminRemarks && (
                  <div className="p-3 bg-[#0b0a08] rounded-2xl border border-stone-800/90 text-stone-200">
                    <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">
                      Warden Remarks
                    </span>
                    <p className="italic">{latestApplication.adminRemarks}</p>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    to="/student/applications"
                    className="block text-center py-2.5 px-3 bg-stone-900/80 hover:bg-amber-500/15 text-amber-200 hover:text-amber-100 font-bold rounded-2xl border border-amber-500/30 transition-all shadow-sm"
                  >
                    View All Applications
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-2.5">
                <Clock className="w-8 h-8 text-amber-400/50 mx-auto" />
                <p className="text-xs text-stone-400">No application submitted yet.</p>
                <Link
                  to="/student/apply"
                  className="inline-block px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20"
                >
                  Apply Now
                </Link>
              </div>
            )}
          </div>

          {/* Student Profile Quick View */}
          <div className="glass-panel rounded-3xl p-6 space-y-3.5 text-xs text-stone-100">
            <h3 className="text-sm font-black text-stone-100 pb-2 border-b border-stone-800/90 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>Student Profile</span>
            </h3>

            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">Full Name</span>
              <p className="font-bold text-stone-100 text-sm">{student?.name}</p>
            </div>

            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">Email Address</span>
              <p className="text-stone-300 font-mono">{student?.email}</p>
            </div>

            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">Contact Number</span>
              <p className="text-stone-300 font-mono">{student?.phoneNumber || 'Not provided'}</p>
            </div>

            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">Gender</span>
              <p className="text-stone-300">{student?.gender}</p>
            </div>

            <div className="pt-2">
              <Link
                to="/student/profile"
                className="block text-center py-2.5 px-3 bg-stone-900/80 hover:bg-amber-500/15 text-amber-300 hover:text-amber-200 border border-amber-500/30 rounded-2xl font-bold transition-all shadow-sm"
              >
                Update Profile &amp; Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
