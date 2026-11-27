import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DoorOpen,
  Users,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  BedDouble,
  MapPin,
} from 'lucide-react';
import { allocationService } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getRoomImage } from '../../data/campusImages';

export const MyRoomPage = () => {
  const [allocationData, setAllocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRoomData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await allocationService.getMy();
      if (res.data.success) {
        setAllocationData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your room details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading your allocated residence profile..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-950/60 border border-rose-500/30 rounded-3xl text-rose-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span className="text-sm font-medium">{error}</span>
        </div>
        <button
          onClick={fetchRoomData}
          className="px-4 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-500 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!allocationData?.hasAllocation || !allocationData?.allocation) {
    return (
      <div className="max-w-xl mx-auto glass-panel p-12 text-center rounded-3xl space-y-4 animate-fade-up">
        <DoorOpen className="w-16 h-16 text-amber-400/60 mx-auto" />
        <h2 className="text-lg font-extrabold text-stone-100">No Room Allocated Yet</h2>
        <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
          You have not been allocated a hostel room yet. Once your application is reviewed and approved by the warden, your room credentials and roommates will appear here.
        </p>
        <div className="pt-2">
          <Link
            to="/student/apply"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-stone-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <BedDouble className="w-4 h-4" />
            <span>Submit Room Application</span>
          </Link>
        </div>
      </div>
    );
  }

  const { allocation, roommates } = allocationData;
  const { room, hostel } = allocation;
  const roomPhoto = getRoomImage(room?.roomType);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      {/* Header with Photo Preview */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={roomPhoto}
            alt={room?.roomNumber}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12100e] via-[#12100e]/65 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-200 border border-amber-400/35 backdrop-blur-md">
                  {room?.roomType} Suite
                </span>
                <Badge status="Active" />
              </div>
              <h1 className="text-2xl font-extrabold text-stone-100 tracking-tight mt-1.5">
                Room {room?.roomNumber} • {hostel?.name}
              </h1>
              <p className="text-xs text-stone-300 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{hostel?.location}</span>
              </p>
            </div>

            <div className="text-left sm:text-right bg-[#0b0a08]/90 px-4 py-3 rounded-2xl border border-amber-500/25 backdrop-blur-md">
              <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Semester Rate</span>
              <p className="text-lg font-extrabold text-amber-400">
                ₹{allocation.monthlyFee?.toLocaleString()}
                <span className="text-xs font-normal text-stone-400">/mo</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Room Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card glass-card-hover p-5 rounded-3xl">
          <p className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Floor Level</p>
          <p className="text-base font-bold text-stone-100 mt-1">Floor {room?.floor}</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Out of {hostel?.totalFloors} floors</p>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-3xl">
          <p className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Room Category</p>
          <p className="text-base font-bold text-stone-100 mt-1">{room?.roomType} Room</p>
          <p className="text-[11px] text-stone-400 mt-0.5">{room?.capacity} Beds Total</p>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-3xl">
          <p className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Allocated Date</p>
          <p className="text-base font-bold text-stone-100 mt-1">
            {new Date(allocation.allocationDate).toLocaleDateString()}
          </p>
          <p className="text-[11px] text-emerald-400 font-medium mt-0.5">Verified Active</p>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-3xl">
          <p className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Hostel Type</p>
          <p className="text-base font-bold text-stone-100 mt-1">{hostel?.type} Hostel</p>
          <p className="text-[11px] text-stone-400 mt-0.5">{hostel?.name}</p>
        </div>
      </div>

      {/* Roommates Card */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800/90 mb-4">
          <h2 className="text-sm font-bold text-stone-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Roommates in Room {room?.roomNumber}</span>
          </h2>
          <span className="text-xs text-amber-300 font-semibold">
            {room?.currentOccupancy} of {room?.capacity} beds occupied
          </span>
        </div>

        {roommates && roommates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roommates.map((rm) => (
              <div
                key={rm._id}
                className="p-4 bg-[#0b0a08] rounded-2xl border border-stone-800/90 hover:border-amber-500/30 transition-colors flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-black text-sm shadow-lg shadow-amber-500/20 flex-shrink-0">
                  {rm.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-stone-100 truncate">{rm.name}</h4>
                  <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                    Roll No: {rm.rollNumber || 'N/A'}
                  </p>
                  <p className="text-[11px] text-stone-300 mt-0.5 truncate">{rm.course}</p>
                  <p className="text-[11px] text-stone-400">{rm.year} • {rm.gender}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-[#0b0a08] rounded-2xl border border-stone-800/90 text-center text-xs text-stone-400">
            {room?.roomType === 'Single'
              ? 'You are assigned to a single private room with no roommates.'
              : 'There are currently no other students assigned to this room.'}
          </div>
        )}
      </div>

      {/* Amenities & Warden Support Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Amenities */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-stone-100 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Included Room Amenities</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {room?.amenities && room.amenities.length > 0 ? (
              room.amenities.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-amber-500/10 text-amber-300 text-xs font-medium rounded-xl border border-amber-500/25"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-xs text-stone-400">Standard hostel furnishing included.</span>
            )}
          </div>
        </div>

        {/* Warden Contact */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-stone-100 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Hostel Warden &amp; Support</span>
          </h3>
          <div className="space-y-1.5 text-xs text-stone-300">
            <p>
              <strong className="text-stone-100">Warden:</strong>{' '}
              {hostel?.wardenName || 'Chief Hostel Warden Office'}
            </p>
            <p>
              <strong className="text-stone-100">Helpline:</strong>{' '}
              {hostel?.wardenContact || '+91 9876543210'}
            </p>
            <p className="text-stone-400 text-[11px] pt-1">
              For maintenance, electrical, or plumbing requests, contact the warden office.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRoomPage;
