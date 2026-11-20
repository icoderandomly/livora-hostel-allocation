import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Hash,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export const StudentProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { success, error: toastError } = useToast();

  const [profileData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    course: user?.course || '',
    year: user?.year || '',
    gender: user?.gender || 'Male',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      await updateProfile(profileData);
      success('Personal profile updated successfully!');
    } catch (err) {
      toastError(err.response?.data?.message || err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toastError('New passwords do not match.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toastError('New password must be at least 6 characters.');
      return;
    }

    try {
      setPasswordLoading(true);
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toastError(err.response?.data?.message || err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-[#0c1429]/90 p-6 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-400" />
          Student Profile & Security
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your enrolled university details and manage your account credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="bg-[#0c1429]/90 p-6 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-indigo-950/80">
            <User className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Personal Information</h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setFormData({ ...profileData, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Roll Number</label>
                <input
                  type="text"
                  disabled
                  value={user?.rollNumber || ''}
                  className="w-full px-3 py-2 bg-[#050914] border border-indigo-950/40 rounded-xl text-indigo-400 font-mono cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Gender</label>
                <select
                  value={profileData.gender}
                  onChange={(e) => setFormData({ ...profileData, gender: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 bg-[#050914] border border-indigo-950/40 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={profileData.phoneNumber}
                onChange={(e) => setFormData({ ...profileData, phoneNumber: e.target.value })}
                className="w-full px-3 py-2 bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Course / Degree</label>
                <input
                  type="text"
                  required
                  value={profileData.course}
                  onChange={(e) => setFormData({ ...profileData, course: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Academic Year</label>
                <input
                  type="text"
                  required
                  value={profileData.year}
                  onChange={(e) => setFormData({ ...profileData, year: e.target.value })}
                  className="w-full px-3 py-2 bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-md shadow-indigo-950/50 disabled:opacity-50 transition-all active:scale-95"
              >
                {profileLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-[#0c1429]/90 p-6 rounded-3xl border border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.36)] backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-indigo-950/80">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Current Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
                className="w-full px-3 py-2 bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">New Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                placeholder="Min 6 characters"
                className="w-full px-3 py-2 bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Confirm New Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                placeholder="Confirm new password"
                className="w-full px-3 py-2 bg-[#070e24] border border-indigo-950/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide' : 'Show'} Passwords</span>
              </button>

              <button
                type="submit"
                disabled={passwordLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-md shadow-indigo-950/50 disabled:opacity-50 transition-all active:scale-95"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
