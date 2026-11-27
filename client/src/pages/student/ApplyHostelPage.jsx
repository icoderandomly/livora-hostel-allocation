import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BedDouble,
  Building2,
  User,
  Heart,
  Send,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { hostelService, applicationService, allocationService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ApplyHostelPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasExistingApp, setHasExistingApp] = useState(false);
  const [hasAllocation, setHasAllocation] = useState(false);

  const [formData, setFormData] = useState({
    preferredHostel: '',
    roomType: 'Double',
    preferredFloor: 1,
    personalDetails: {
      emergencyContactName: '',
      emergencyContactPhone: '',
      bloodGroup: '',
      medicalCondition: '',
      specialRequests: '',
    },
  });

  useEffect(() => {
    const checkStatusAndLoadHostels = async () => {
      try {
        setLoading(true);
        const [hostelRes, allocRes, appRes] = await Promise.all([
          hostelService.getAll(),
          allocationService.getMy(),
          applicationService.getMy(),
        ]);

        if (hostelRes.data.success) {
          setHostels(hostelRes.data.hostels);
          if (hostelRes.data.hostels.length > 0) {
            setFormData((prev) => ({
              ...prev,
              preferredHostel: hostelRes.data.hostels[0]._id,
            }));
          }
        }

        if (allocRes.data.hasAllocation) {
          setHasAllocation(true);
        }

        if (appRes.data.success) {
          const activeApp = appRes.data.applications.find(
            (a) => a.status === 'Pending' || a.status === 'Approved'
          );
          if (activeApp) {
            setHasExistingApp(true);
          }
        }
      } catch (err) {
        toastError('Failed to load application form options.');
      } finally {
        setLoading(false);
      }
    };

    checkStatusAndLoadHostels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('pd.')) {
      const field = name.replace('pd.', '');
      setFormData((prev) => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.preferredHostel) {
      setErrorMessage('Please select a preferred hostel.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      const res = await applicationService.create(formData);
      if (res.data.success) {
        success('Hostel application submitted successfully!');
        navigate('/student/applications');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application.';
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Preparing hostel application form..." />;
  }

  // If student already has room allocated
  if (hasAllocation) {
    return (
      <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl text-center space-y-4 animate-fade-up">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/30">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-lg font-extrabold text-stone-100">Room Already Allocated</h2>
        <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
          You currently have an active hostel room allocation. Under university guidelines, students with an active allocation cannot submit a new application.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/student/my-room')}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-stone-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-95"
          >
            Go to My Room
          </button>
        </div>
      </div>
    );
  }

  // If student already has pending or approved application
  if (hasExistingApp) {
    return (
      <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl text-center space-y-4 animate-fade-up">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-950/30">
          <Info className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-lg font-extrabold text-stone-100">Application Under Review</h2>
        <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
          You already have an active application currently being reviewed by the warden office. You can track its live status below.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/student/applications')}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-stone-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-95"
          >
            View My Application Status
          </button>
        </div>
      </div>
    );
  }

  const selectedHostelDoc = hostels.find((h) => h._id === formData.preferredHostel);

  const inputClass =
    'w-full px-3.5 py-2.5 text-xs bg-[#0b0a08] border border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400 font-medium text-stone-100 placeholder-stone-500 transition-all';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
      <div className="glass-panel p-6 rounded-3xl">
        <h1 className="text-xl font-extrabold text-stone-100 tracking-tight flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <BedDouble className="w-5 h-5" />
          </span>
          Hostel Room Allocation Application
        </h1>
        <p className="text-xs text-stone-400 mt-1.5">
          Complete the official university accommodation request. Applications are processed based on eligibility and room vacancy.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Pre-filled Student Details */}
          <div>
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>1. Student Profile Snapshot</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#0b0a08] rounded-2xl border border-stone-800/90 text-xs">
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Name</p>
                <p className="font-bold text-stone-100 mt-0.5">{user?.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Roll No.</p>
                <p className="font-mono font-bold text-amber-400 mt-0.5">{user?.rollNumber}</p>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Course &amp; Year</p>
                <p className="text-stone-200 mt-0.5 font-medium">{user?.course} ({user?.year})</p>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Gender</p>
                <p className="text-stone-200 mt-0.5 font-medium">{user?.gender}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Accommodation Preferences */}
          <div>
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>2. Residence &amp; Room Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Preferred Hostel *
                </label>
                <select
                  name="preferredHostel"
                  required
                  value={formData.preferredHostel}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {hostels.map((h) => (
                    <option key={h._id} value={h._id} className="bg-[#12100e] text-stone-100">
                      {h.name} ({h.type}) - {h.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Room Type Preference *
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Single" className="bg-[#12100e] text-stone-100">Single (Private 1-Bed)</option>
                  <option value="Double" className="bg-[#12100e] text-stone-100">Double (2 Sharing)</option>
                  <option value="Triple" className="bg-[#12100e] text-stone-100">Triple (3 Sharing)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Preferred Floor (1 - {selectedHostelDoc?.totalFloors || 3})
                </label>
                <input
                  type="number"
                  name="preferredFloor"
                  min="0"
                  max={selectedHostelDoc?.totalFloors || 5}
                  value={formData.preferredFloor}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Personal & Emergency Contact Details */}
          <div>
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>3. Emergency Contacts &amp; Medical Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  name="pd.emergencyContactName"
                  required
                  value={formData.personalDetails.emergencyContactName}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Sharma (Father)"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Emergency Phone Number *
                </label>
                <input
                  type="tel"
                  name="pd.emergencyContactPhone"
                  required
                  value={formData.personalDetails.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Blood Group
                </label>
                <select
                  name="pd.bloodGroup"
                  value={formData.personalDetails.bloodGroup}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="" className="bg-[#12100e] text-stone-100">Select Blood Group</option>
                  <option value="A+" className="bg-[#12100e] text-stone-100">A+</option>
                  <option value="A-" className="bg-[#12100e] text-stone-100">A-</option>
                  <option value="B+" className="bg-[#12100e] text-stone-100">B+</option>
                  <option value="B-" className="bg-[#12100e] text-stone-100">B-</option>
                  <option value="O+" className="bg-[#12100e] text-stone-100">O+</option>
                  <option value="O-" className="bg-[#12100e] text-stone-100">O-</option>
                  <option value="AB+" className="bg-[#12100e] text-stone-100">AB+</option>
                  <option value="AB-" className="bg-[#12100e] text-stone-100">AB-</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Special Accommodation Requests or Medical Notes (Optional)
                </label>
                <textarea
                  name="pd.specialRequests"
                  rows="2"
                  value={formData.personalDetails.specialRequests}
                  onChange={handleChange}
                  placeholder="e.g. Quiet room preferred for thesis prep, or ground floor needed for mobility reasons."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-[11px] text-stone-400">
              By submitting, you agree to abide by university hostel codes of conduct.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-stone-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyHostelPage;
