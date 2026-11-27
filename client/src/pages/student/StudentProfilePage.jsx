import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
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

  const inputClass =
    'w-full px-3.5 py-2.5 bg-[#0b0a08] border border-stone-800 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400 transition-all';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-3xl">
        <h1 className="text-xl font-extrabold text-stone-100 tracking-tight flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <User className="w-5 h-5" />
          </span>
          Student Profile &amp; Security
        </h1>
        <p className="text-xs text-stone-400 mt-1.5">
          Review your enrolled university details and manage your account credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-800/90">
            <User className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-stone-100">Personal Information</h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setFormData({ ...profileData, name: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-300 mb-1.5">Roll Number</label>
                <input
                  type="text"
                  disabled
                  value={user?.rollNumber || ''}
                  className="w-full px-3.5 py-2.5 bg-[#080706] border border-stone-800/70 rounded-xl text-amber-400 font-mono cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-300 mb-1.5">Gender</label>
                <select
                  value={profileData.gender}
                  onChange={(e) => setFormData({ ...profileData, gender: e.target.value })}
                  className={inputClass}
                >
                  <option value="Male" className="bg-[#12100e] text-stone-100">Male</option>
                  <option value="Female" className="bg-[#12100e] text-stone-100">Female</option>
                  <option value="Other" className="bg-[#12100e] text-stone-100">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-[#080706] border border-stone-800/70 rounded-xl text-stone-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1.5">Phone Number</label>
              <input
                type="tel"
                required
                value={profileData.phoneNumber}
                onChange={(e) => setFormData({ ...profileData, phoneNumber: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-300 mb-1.5">Course / Degree</label>
                <input
                  type="text"
                  required
                  value={profileData.course}
                  onChange={(e) => setFormData({ ...profileData, course: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-300 mb-1.5">Academic Year</label>
                <input
                  type="text"
                  required
                  value={profileData.year}
                  onChange={(e) => setFormData({ ...profileData, year: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-stone-950 font-black rounded-xl shadow-lg shadow-amber-500/25 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
              >
                {profileLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-800/90">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-stone-100">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-300 mb-1.5">Current Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1.5">New Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                placeholder="Min 6 characters"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1.5">Confirm New Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                placeholder="Confirm new password"
                className={inputClass}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-semibold"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide' : 'Show'} Passwords</span>
              </button>

              <button
                type="submit"
                disabled={passwordLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-stone-950 font-black rounded-xl shadow-lg shadow-amber-500/25 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
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
