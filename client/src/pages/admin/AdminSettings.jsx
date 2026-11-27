import React, { useState } from 'react';
import {
  Settings,
  Database,
  User,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export const AdminSettings = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { success, error: toastError } = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
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
      success('Admin profile updated successfully!');
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-3xl">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          System & Account Settings
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Manage warden administrator credentials, security preferences, and database configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Profile Form */}
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-800">
            <User className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Admin Account Info</h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#0b0a08] border border-stone-800 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 bg-[#080706] border border-stone-800/60 rounded-xl text-stone-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={profileData.phoneNumber}
                onChange={(e) =>
                  setProfileData({ ...profileData, phoneNumber: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#0b0a08] border border-stone-800 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black rounded-xl shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all active:scale-95"
              >
                {profileLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-800">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Security & Password</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">Current Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
                className="w-full px-3 py-2 bg-[#0b0a08] border border-stone-800 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">New Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                placeholder="Min 6 characters"
                className="w-full px-3 py-2 bg-[#0b0a08] border border-stone-800 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">Confirm New Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 bg-[#0b0a08] border border-stone-800 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-400"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
              </button>

              <button
                type="submit"
                disabled={passwordLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black rounded-xl shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all active:scale-95"
              >
                {passwordLoading ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MongoDB Atlas Integration Info Box */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white">Database & MongoDB Atlas Connectivity</h2>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed mb-4">
          This system supports both local and cloud <strong>MongoDB Atlas</strong> integration. To connect your production MongoDB Atlas cluster:
        </p>

        <div className="p-4 bg-[#080706] text-stone-200 rounded-2xl border border-stone-800 font-mono text-xs overflow-x-auto space-y-1">
          <p className="text-stone-400"># In file: server/.env or Vercel Environment Variables</p>
          <p className="text-emerald-400">MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.abcde.mongodb.net/hostel_db?retryWrites=true&amp;w=majority</p>
          <p className="text-stone-400"># Ensure 0.0.0.0/0 is whitelisted under Network Access in MongoDB Atlas console</p>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>
            Database engine active. Connected and synced with live university residences, room inventories, and student profiles.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
