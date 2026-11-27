import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Hash,
  BookOpen,
  Calendar,
  Phone,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNumber: '',
    course: '',
    year: '1st Year / 1st Sem',
    phoneNumber: '',
    gender: 'Male',
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

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      const newUser = await register(formData);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#10b981', '#fb923c'],
      });
      success(`Welcome to LIVORA Living, ${newUser.name}! Registration successful.`);
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090807] relative flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute inset-0 bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center mb-6 relative z-10 animate-fade-up">
        <div className="mx-auto w-16 h-16 rounded-2xl p-1 bg-gradient-to-tr from-amber-600 via-yellow-400 to-orange-500 shadow-lg shadow-amber-500/30 animate-float">
          <img src="/livora-logo.svg" alt="LIVORA" className="w-full h-full rounded-[14px] object-cover" />
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/90 border border-amber-500/30 text-[10px] font-bold text-amber-300 tracking-wider uppercase mb-1">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
          SCHOLAR ADMISSIONS & ROOM ALLOTMENT
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
          <span>LIVORA</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400">
            LIVING
          </span>
        </h2>
        <p className="mt-1 text-xs text-stone-400">
          Student Residence Registration & University Room Application Portal
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10 animate-fade-up">
        <div className="glass-panel py-8 px-6 shadow-[0_24px_64px_rgba(0,0,0,0.85)] rounded-3xl sm:px-10 border border-amber-500/25 text-stone-100">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-800/80">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Sign In</span>
            </Link>
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">New Scholar Enrollment</span>
          </div>

          {errorMessage && (
            <div className="mb-5 flex items-start gap-3 p-3.5 bg-rose-950/60 border border-rose-800/60 rounded-2xl text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/80">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#0b0a08] border border-stone-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all text-stone-100 placeholder:text-stone-500"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/80">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul@student.edu"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#0b0a08] border border-stone-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all text-stone-100 placeholder:text-stone-500"
                  />
                </div>
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1">
                  University Roll Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/80">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="rollNumber"
                    required
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="e.g. CS2024099"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#0b0a08] border border-stone-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all text-stone-100 placeholder:text-stone-500 font-mono"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/80">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#0b0a08] border border-stone-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all text-stone-100 placeholder:text-stone-500"
                  />
                </div>
              </div>

              {/* Course */}
              <div>
                <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1">
                  Course / Degree *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/80">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="course"
                    required
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#0b0a08] border border-stone-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all text-stone-100 placeholder:text-stone-500"
                  />
                </div>
              </div>

              {/* Year / Semester */}
              <div>
                <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1">
                  Academic Year / Semester *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/80">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#0b0a08] border border-stone-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all text-stone-100"
                  >
                    <option value="1st Year / 1st Sem" className="bg-[#12100e] text-stone-100">1st Year / 1st Sem</option>
                    <option value="1st Year / 2nd Sem" className="bg-[#12100e] text-stone-100">1st Year / 2nd Sem</option>
                    <option value="2nd Year / 3rd Sem" className="bg-[#12100e] text-stone-100">2nd Year / 3rd Sem</option>
                    <option value="2nd Year / 4th Sem" className="bg-[#12100e] text-stone-100">2nd Year / 4th Sem</option>
                    <option value="3rd Year / 5th Sem" className="bg-[#12100e] text-stone-100">3rd Year / 5th Sem</option>
                    <option value="3rd Year / 6th Sem" className="bg-[#12100e] text-stone-100">3rd Year / 6th Sem</option>
                    <option value="4th Year / 7th Sem" className="bg-[#12100e] text-stone-100">4th Year / 7th Sem</option>
                    <option value="4th Year / 8th Sem" className="bg-[#12100e] text-stone-100">4th Year / 8th Sem</option>
                    <option value="Postgraduate / Master" className="bg-[#12100e] text-stone-100">Postgraduate / Master</option>
                  </select>
                </div>
              </div>

              {/* Gender */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Gender *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <label
                      key={g}
                      className={`flex items-center justify-center py-2.5 px-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                        formData.gender === g
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200 ring-2 ring-amber-500/30 shadow-sm'
                          : 'border-stone-800 bg-[#0b0a08] text-stone-300 hover:bg-stone-900 hover:border-stone-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/80">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#0b0a08] border border-stone-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all text-stone-100 placeholder:text-stone-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-amber-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/80">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#0b0a08] border border-stone-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all text-stone-100 placeholder:text-stone-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-stone-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Complete Registration</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-stone-400">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2">
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
