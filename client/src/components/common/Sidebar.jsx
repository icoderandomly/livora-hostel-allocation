import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  KeySquare,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  BedDouble,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Zap,
  Activity,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNavItems = [
    { label: 'Executive Command', path: '/admin/dashboard', icon: LayoutDashboard, badge: 'Live' },
    { label: 'Hostel Residencies', path: '/admin/hostels', icon: Building2 },
    { label: 'Room Inventory', path: '/admin/rooms', icon: DoorOpen },
    { label: 'Allocation Engine', path: '/admin/allocations', icon: KeySquare, highlight: true },
    { label: 'Student Applications', path: '/admin/applications', icon: FileText },
    { label: 'Student Directory', path: '/admin/students', icon: Users },
    { label: 'Audits & Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const studentNavItems = [
    { label: 'My Residency Hub', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Apply for Room', path: '/student/apply', icon: BedDouble, highlight: true },
    { label: 'Live Application Tracker', path: '/student/applications', icon: FileText },
    { label: 'Room & Roommates', path: '/student/my-room', icon: DoorOpen },
    { label: 'Profile & Credentials', path: '/student/profile', icon: UserCheck },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-gradient-to-b from-[#050917] via-[#070e24] to-[#040714] text-slate-200 flex flex-col transition-all duration-300 ease-out border-r border-indigo-950/90 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header with Logo Image */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-indigo-950/80 bg-[#040816]/70 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="relative group">
              <img
                src="/livora-logo.svg"
                alt="LIVORA Crest"
                className="w-10 h-10 rounded-2xl shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500 border-2 border-[#050917]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 font-sans">
                  LIVORA
                </h1>
                <span className="text-[9px] font-black tracking-widest text-indigo-400 px-1.5 py-0.2 bg-indigo-950/80 rounded border border-indigo-700/60 uppercase">
                  OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
                Campus Residential Cloud
              </p>
            </div>
          </div>
        </div>

        {/* User Role Card */}
        <div className="px-4 py-4 border-b border-slate-800/60 bg-gradient-to-r from-[#0a0e1a]/80 to-[#0c1222]/80">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all shadow-inner">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-[1.5px] shadow-md">
                  <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center text-white font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0b0f19] flex items-center justify-center">
                  <span className="w-1 h-1 bg-white rounded-full" />
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate hover:text-indigo-300 transition-colors">
                  {user?.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-indigo-300 bg-indigo-950/90 px-2 py-0.5 rounded-full border border-indigo-700/60 shadow-sm">
                      <ShieldCheck className="w-2.5 h-2.5 text-indigo-400" /> CHIEF WARDEN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-700/60 truncate">
                      <GraduationCap className="w-2.5 h-2.5 text-emerald-400" /> {user?.rollNumber || 'SCHOLAR'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu with Smooth Glow Transitions */}
        <div className="flex-1 py-4 px-3.5 overflow-y-auto space-y-1.5">
          <div className="px-3 pb-2 flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
              {isAdmin ? 'Administration Hub' : 'Scholar Services'}
            </span>
            <span className="text-[9px] font-mono text-indigo-300/80 bg-indigo-950/60 border border-indigo-800/40 px-1.5 py-0.5 rounded-md">
              v2.6 Pro
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 via-brand-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-bold border border-indigo-400/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white hover:translate-x-1'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white shadow-inner'
                            : 'bg-slate-800/50 text-slate-400 group-hover:bg-slate-800 group-hover:text-indigo-400'
                        }`}
                      >
                        <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                      </div>
                      <span className="tracking-tight">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                          {item.badge}
                        </span>
                      )}
                      {isActive ? (
                        <ChevronRight className="w-4 h-4 text-white animate-in slide-in-from-left-1 duration-200" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Live Grid Health Footer Pill */}
        <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-900/80">
          <div className="flex items-center justify-between text-[10px] text-slate-400 py-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Campus Grid 100% Online</span>
            </span>
            <span className="font-mono text-slate-500">24ms</span>
          </div>
        </div>

        {/* Bottom Actions & Sign Out */}
        <div className="p-3.5 border-t border-slate-800/80 bg-[#070a12]/70">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 border border-slate-800/60 transition-all duration-200 group"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
              <span>Disconnect Session</span>
            </div>
            <span className="text-[10px] font-mono text-slate-600 group-hover:text-rose-400">Exit</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
