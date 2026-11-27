import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Shield,
  GraduationCap,
  Clock,
  Bell,
  Search,
  ArrowLeft,
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
    <header className="sticky top-0 z-30 h-20 bg-[#0d0c0a]/90 backdrop-blur-2xl border-b border-amber-500/15 px-4 sm:px-8 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.6)] text-stone-100">
      <div className="flex items-center gap-3.5">
        {/* Mobile Hamburger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-2xl text-stone-400 hover:text-amber-300 hover:bg-stone-900/80 lg:hidden transition-colors border border-transparent hover:border-amber-500/30"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Back Navigation Button */}
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900/90 hover:bg-amber-500/15 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-bold transition-all shadow-sm group"
            title="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>
        )}

        {/* Brand & Live Term Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-stone-900/80 border border-amber-500/25 rounded-full text-xs font-bold text-amber-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-tight">Academic Year 2025–26</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-stone-300 px-3 py-1.5 bg-stone-900/70 rounded-full border border-stone-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{time}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search Shortcut Pill */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-stone-900/75 hover:bg-stone-900 rounded-2xl border border-stone-800 hover:border-amber-500/30 text-xs text-stone-300 cursor-pointer transition-all shadow-2xs">
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium">Quick Find...</span>
          <kbd className="px-1.5 py-0.5 bg-[#090807] rounded text-[10px] font-mono text-amber-300 border border-stone-700">
            ⌘K
          </kbd>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 hover:border-amber-500/40 transition-all shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0d0c0a]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#14120f] rounded-3xl border border-amber-500/25 shadow-2xl p-4 z-50 animate-fade-up">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Campus Feed Notifications
                </span>
                <span className="text-[10px] bg-amber-500/15 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-stone-800/70 text-xs">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 hover:bg-stone-900/70 rounded-xl px-2 transition-colors">
                    <p className="font-bold text-stone-100">{n.title}</p>
                    <p className="text-stone-400 text-[11px] mt-0.5">{n.desc}</p>
                    <span className="text-[10px] text-amber-400 font-mono mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role & User Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-stone-900/85 border border-amber-500/20 rounded-2xl text-xs text-stone-200 shadow-2xs">
          {isAdmin ? (
            <>
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white tracking-tight">Warden Administration</span>
            </>
          ) : (
            <>
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-stone-200 truncate max-w-[160px]">
                {user?.course || 'Enrolled Scholar'}
              </span>
            </>
          )}
        </div>

        {/* User Avatar & Name */}
        <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-stone-800">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-stone-950 flex items-center justify-center font-black text-xs shadow-md shadow-amber-500/25">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white leading-tight">{user?.name}</p>
            <p className="text-[10px] text-amber-300 font-mono leading-tight mt-0.5">
              {isAdmin ? 'Chief Warden' : user?.rollNumber}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
