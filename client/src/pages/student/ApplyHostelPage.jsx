import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BedDouble,
  Building2,
  Layers,
  Phone,
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
      <div className="max-w-2xl mx-auto bg-[#0c1429]/90 p-8 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Room Already Allocated</h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          You currently have an active hostel room allocation. Under university guidelines, students with an active allocation cannot submit a new application.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/student/my-room')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-950/50 transition-all active:scale-95"
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
      <div className="max-w-2xl mx-auto bg-[#0c1429]/90 p-8 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl text-center space-y-4">
        <Info className="w-12 h-12 text-indigo-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Application Under Review</h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          You already have an active application currently being reviewed by the warden office. You can track its live status below.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/student/applications')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-950/50 transition-all active:scale-95"
          >
            View My Application Status
          </button>
        </div>
      </div>
    );
  }

  const selectedHostelDoc = hostels.find((h) => h._id === formData.preferredHostel);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[#0c1429]/90 p-6 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BedDouble className="w-6 h-6 text-indigo-400" />
          Hostel Room Allocation Application
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete the official university accommodation request. Applications are processed based on eligibility and room vacancy.
        </p>
      </div>

      <div className="bg-[#0c1429]/90 p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl">
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Pre-filled Student Details */}
          <div>
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>1. Student Profile Snapshot</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#070e24] rounded-2xl border border-indigo-950/80 text-xs">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Name</p>
                <p className="font-bold text-white mt-0.5">{user?.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Roll No.</p>
                <p className="font-mono font-bold text-indigo-400 mt-0.5">{user?.rollNumber}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Course & Year</p>
                <p className="text-slate-200 mt-0.5 font-medium">{user?.course} ({user?.year})</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Gender</p>
                <p className="text-slate-200 mt-0.5 font-medium">{user?.gender}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Accommodation Preferences */}
          <div>
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>2. Residence & Room Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preferred Hostel *
                </label>
                <select
                  name="preferredHostel"
                  required
                  value={formData.preferredHostel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 font-medium text-slate-200"
                >
                  {hostels.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name} ({h.type}) - {h.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Room Type Preference *
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 font-medium text-slate-200"
                >
                  <option value="Single">Single (Private 1-Bed)</option>
                  <option value="Double">Double (2 Sharing)</option>
                  <option value="Triple">Triple (3 Sharing)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preferred Floor (1 - {selectedHostelDoc?.totalFloors || 3})
                </label>
                <input
                  type="number"
                  name="preferredFloor"
                  min="0"
                  max={selectedHostelDoc?.totalFloors || 5}
                  value={formData.preferredFloor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Personal & Emergency Contact Details */}
          <div>
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>3. Emergency Contacts & Medical Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  name="pd.emergencyContactName"
                  required
                  value={formData.personalDetails.emergencyContactName}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Sharma (Father)"
                  className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Emergency Phone Number *
                </label>
                <input
                  type="tel"
                  name="pd.emergencyContactPhone"
                  required
                  value={formData.personalDetails.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Blood Group
                </label>
                <select
                  name="pd.bloodGroup"
                  value={formData.personalDetails.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Special Accommodation Requests or Medical Notes (Optional)
                </label>
                <textarea
                  name="pd.specialRequests"
                  rows="2"
                  value={formData.personalDetails.specialRequests}
                  onChange={handleChange}
                  placeholder="e.g. Quiet room preferred for thesis prep, or ground floor needed for mobility reasons."
                  className="w-full px-3 py-2 text-xs bg-[#070e24] border border-indigo-950/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-200 placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-indigo-950/80 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">
              By submitting, you agree to abide by university hostel codes of conduct.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-2xl shadow-md shadow-indigo-950/50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
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
