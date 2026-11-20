import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Shield,
  GraduationCap,
  Building2,
  Sparkles,
  Clock,
  Bell,
  Search,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isHome = location.pathname === '/admin/dashboard' || location.pathname === '/student/dashboard';

  const notifications = [
    { id: 1, title: 'Room Allocation Synced', desc: 'Aarav Patel confirmed in SH-201', time: '10m ago' },
    { id: 2, title: 'Maintenance Cleared', desc: 'Mandakini MD-101 inspection passed', time: '42m ago' },
    { id: 3, title: 'Application Submitted', desc: 'Vikramaditya Roy filed request', time: '2h ago' },
  ];

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#070e24]/90 backdrop-blur-2xl border-b border-indigo-950/80 px-4 sm:px-8 flex items-center justify-between shadow-lg text-white">
      <div className="flex items-center gap-3.5">
        {/* Mobile Hamburger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-2xl text-slate-400 hover:text-white hover:bg-indigo-950/80 lg:hidden transition-colors border border-transparent hover:border-indigo-800/50"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Back Navigation Button (Working on all pages!) */}
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-950/90 hover:bg-indigo-900 text-sky-300 hover:text-white border border-indigo-700/60 text-xs font-bold transition-all shadow-sm group"
            title="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>
        )}

        {/* Brand & Live Term Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-indigo-950/80 border border-indigo-800/60 rounded-full text-xs font-bold text-sky-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-tight">Academic Year 2025–26</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-300 px-3 py-1.5 bg-indigo-950/60 rounded-full border border-indigo-800/40">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{time}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search Shortcut Pill */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/60 rounded-2xl border border-indigo-800/50 text-xs text-slate-300 cursor-pointer transition-colors shadow-2xs">
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-medium">Quick Find...</span>
          <kbd className="px-1.5 py-0.5 bg-[#0a122c] rounded text-[10px] font-mono text-indigo-300 border border-indigo-700/50 shadow-2xs">
            ⌘K
          </kbd>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-2xl bg-indigo-950/70 hover:bg-indigo-900 text-slate-300 hover:text-sky-300 border border-indigo-800/60 transition-colors shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400 ring-2 ring-[#070e24]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#091129] rounded-3xl border border-indigo-800/80 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-900/60">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Campus Feed Notifications
                </span>
                <span className="text-[10px] bg-indigo-900/80 text-sky-300 font-bold px-2 py-0.5 rounded-full border border-indigo-700/60">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-indigo-950/80 text-xs">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 hover:bg-indigo-950/50 rounded-xl px-2 transition-colors">
                    <p className="font-bold text-slate-100">{n.title}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{n.desc}</p>
                    <span className="text-[10px] text-sky-400 font-mono mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role & User Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-indigo-950/80 border border-indigo-800/60 rounded-2xl text-xs text-slate-200 shadow-2xs">
          {isAdmin ? (
            <>
              <Shield className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-white tracking-tight">Warden Administration</span>
            </>
          ) : (
            <>
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200 truncate max-w-[160px]">
                {user?.course || 'Enrolled Scholar'}
              </span>
            </>
          )}
        </div>

        {/* User Avatar & Name */}
        <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-indigo-900/60">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white flex items-center justify-center font-black text-xs shadow-md shadow-blue-600/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white leading-tight">{user?.name}</p>
            <p className="text-[10px] text-sky-300 font-mono leading-tight mt-0.5">
              {isAdmin ? 'Chief Warden' : user?.rollNumber}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
