import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
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
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
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
    <div className="min-h-screen bg-[#070b14] relative flex flex-col justify-center py-10 sm:px-6 lg:px-8 overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center mb-6 relative z-10">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-brand-600 p-[1.5px] shadow-lg shadow-indigo-600/30 animate-float">
          <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center text-white">
            <Building2 className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-[10px] font-bold text-indigo-300 tracking-wider uppercase mb-1">
          <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />
          SCHOLAR ADMISSIONS & ROOM ALLOTMENT
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
          <span>LIVORA</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">
            LIVING
          </span>
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Student Residence Registration & University Room Application Portal
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-200/90">
          {errorMessage && (
            <div className="mb-5 flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul@student.edu"
                    className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
                  />
                </div>
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  University Roll Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="rollNumber"
                    required
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="e.g. CS2024099"
                    className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
                  />
                </div>
              </div>

              {/* Course */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Course / Degree *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="course"
                    required
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
                  />
                </div>
              </div>

              {/* Year / Semester */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Year / Semester *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
                  >
                    <option value="1st Year / 1st Sem">1st Year / 1st Sem</option>
                    <option value="1st Year / 2nd Sem">1st Year / 2nd Sem</option>
                    <option value="2nd Year / 3rd Sem">2nd Year / 3rd Sem</option>
                    <option value="2nd Year / 4th Sem">2nd Year / 4th Sem</option>
                    <option value="3rd Year / 5th Sem">3rd Year / 5th Sem</option>
                    <option value="3rd Year / 6th Sem">3rd Year / 6th Sem</option>
                    <option value="4th Year / 7th Sem">4th Year / 7th Sem</option>
                    <option value="4th Year / 8th Sem">4th Year / 8th Sem</option>
                    <option value="Postgraduate / Master">Postgraduate / Master</option>
                  </select>
                </div>
              </div>

              {/* Gender */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <label
                      key={g}
                      className={`flex items-center justify-center py-2 px-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        formData.gender === g
                          ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
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
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-brand-600/25 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Complete Registration</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 underline">
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
