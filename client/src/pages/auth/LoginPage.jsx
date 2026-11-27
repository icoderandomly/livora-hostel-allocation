import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Shield,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export const LoginPage = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      const loggedInUser = await login(formData.email, formData.password);
      success(`Welcome to LIVORA Living, ${loggedInUser.name}!`);

      if (loggedInUser.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid credentials.';
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = async (email, pass, autoSubmit = false) => {
    setFormData({ email, password: pass });
    setErrorMessage('');
    if (autoSubmit) {
      try {
        setLoading(true);
        const loggedInUser = await login(email, pass);
        success(`Welcome to LIVORA Living, ${loggedInUser.name}!`);
        if (loggedInUser.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true });
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Invalid credentials.';
        setErrorMessage(msg);
        toastError(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#090807] relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Warm Obsidian Gold & Copper Ambient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute inset-0 bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center animate-fade-up">
        {/* Brand Logo Image */}
        <div className="mx-auto w-20 h-20 rounded-3xl p-1 bg-gradient-to-tr from-amber-600 via-yellow-400 to-orange-500 shadow-2xl shadow-amber-500/30 animate-float">
          <img
            src="/livora-logo.svg"
            alt="LIVORA"
            className="w-full h-full rounded-[22px] object-cover"
          />
        </div>

        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900/90 border border-amber-500/30 text-[10px] font-bold text-amber-300 tracking-wider uppercase mb-1 shadow-sm">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
          AUTONOMOUS RESIDENTIAL CLOUD
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-2.5 font-sans">
          <span>LIVORA</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400">
            LIVING
          </span>
        </h2>
        <p className="mt-1 text-xs text-stone-300 font-medium tracking-wide">
          University Residence Management & Smart Room Allocation OS
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 animate-fade-up">
        <div className="glass-panel py-8 px-6 sm:px-10 shadow-[0_24px_64px_rgba(0,0,0,0.85)] rounded-3xl border border-amber-500/25 text-stone-100">
          {errorMessage && (
            <div className="mb-5 flex items-start gap-3 p-3.5 bg-rose-950/60 border border-rose-800/60 rounded-2xl text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Official Campus Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4 text-amber-400/80" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@stayhostel.edu or roll@student.edu"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#0b0a08] border border-stone-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all text-stone-100 font-medium placeholder:text-stone-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4 text-amber-400/80" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your security password"
                  className="w-full pl-10 pr-11 py-2.5 text-xs bg-[#0b0a08] border border-stone-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all text-stone-100 font-medium placeholder:text-stone-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-amber-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-stone-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to LIVORA Portal</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-5 border-t border-stone-800/80">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant 1-Click Persona Sign-In</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@stayhostel.edu', 'Admin@123', true)}
                className="flex items-start gap-2 p-3 rounded-2xl bg-stone-900/90 hover:bg-amber-500/15 hover:border-amber-400/60 border border-stone-800 transition-all duration-200 hover:-translate-y-0.5 text-left group shadow-sm"
              >
                <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 mt-0.5 group-hover:scale-110 transition-transform">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white group-hover:text-amber-300 truncate">Warden Admin ⚡</p>
                  <p className="text-[10px] text-amber-300/80 truncate">admin@stayhostel.edu</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('aarav.patel@student.edu', 'Student@123', true)}
                className="flex items-start gap-2 p-3 rounded-2xl bg-stone-900/90 hover:bg-emerald-500/15 hover:border-emerald-400/60 border border-stone-800 transition-all duration-200 hover:-translate-y-0.5 text-left group shadow-sm"
              >
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white group-hover:text-emerald-300 truncate">Aarav Patel (Student)</p>
                  <p className="text-[10px] text-emerald-300/80 truncate">Shivalik SH-201</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('rohan.verma@student.edu', 'Student@123', true)}
                className="flex items-start gap-2 p-2.5 rounded-2xl bg-stone-900/75 hover:bg-emerald-500/15 hover:border-emerald-400/50 border border-stone-800/80 transition-all duration-200 hover:-translate-y-0.5 text-left group"
              >
                <div className="p-1 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5">
                  <GraduationCap className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white group-hover:text-emerald-300 truncate">Rohan Verma</p>
                  <p className="text-[10px] text-stone-400 truncate">Shivalik Roommate</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('ananya.sharma@student.edu', 'Student@123', true)}
                className="flex items-start gap-2 p-2.5 rounded-2xl bg-stone-900/75 hover:bg-yellow-500/15 hover:border-yellow-400/50 border border-stone-800/80 transition-all duration-200 hover:-translate-y-0.5 text-left group"
              >
                <div className="p-1 rounded-xl bg-yellow-500/20 text-yellow-300 mt-0.5">
                  <GraduationCap className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white group-hover:text-yellow-300 truncate">Ananya Sharma</p>
                  <p className="text-[10px] text-stone-400 truncate">Mandakini MD-101</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('sneha.k@student.edu', 'Student@123', true)}
                className="flex items-start gap-2 p-2.5 rounded-2xl bg-stone-900/75 hover:bg-orange-500/15 hover:border-orange-400/50 border border-stone-800/80 transition-all duration-200 hover:-translate-y-0.5 text-left group"
              >
                <div className="p-1 rounded-xl bg-orange-500/20 text-orange-400 mt-0.5">
                  <GraduationCap className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white group-hover:text-orange-300 truncate">Sneha Kulkarni</p>
                  <p className="text-[10px] text-stone-400 truncate">Mandakini Resident</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('vikram.roy@student.edu', 'Student@123', true)}
                className="flex items-start gap-2 p-2.5 rounded-2xl bg-stone-900/75 hover:bg-amber-500/15 hover:border-amber-400/50 border border-stone-800/80 transition-all duration-200 hover:-translate-y-0.5 text-left group"
              >
                <div className="p-1 rounded-xl bg-amber-500/20 text-amber-400 mt-0.5">
                  <GraduationCap className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white group-hover:text-amber-300 truncate">Vikramaditya Roy</p>
                  <p className="text-[10px] text-stone-400 truncate">Nilgiri NL-501</p>
                </div>
              </button>
            </div>
          </div>

          {/* Student Registration Link */}
          <div className="mt-6 text-center text-xs text-stone-400">
            New university scholar?{' '}
            <Link to="/register" className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2">
              Register as Resident Scholar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
