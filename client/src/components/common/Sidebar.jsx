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
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-gradient-to-b from-[#0b0a08] via-[#100e0b] to-[#080706] text-stone-200 flex flex-col transition-all duration-300 ease-out border-r border-amber-500/15 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header with Logo Image */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-stone-800/90 bg-[#080706]/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="relative group">
              <img
                src="/livora-logo.svg"
                alt="LIVORA Crest"
                className="w-10 h-10 rounded-2xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-[#0b0a08]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-400 font-sans">
                  LIVORA
                </h1>
                <span className="text-[9px] font-black tracking-widest text-amber-300 px-1.5 py-0.2 bg-amber-500/10 rounded border border-amber-500/30 uppercase">
                  OS
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-medium tracking-tight mt-0.5">
                Campus Residential Cloud
              </p>
            </div>
          </div>
        </div>

        {/* User Role Card */}
        <div className="px-4 py-4 border-b border-stone-800/80 bg-[#0d0b09]/80">
          <div className="p-3 rounded-2xl bg-stone-900/75 border border-stone-800 hover:border-amber-500/35 transition-all shadow-inner">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-700 p-[1.5px] shadow-md">
                  <div className="w-full h-full bg-[#0d0b09] rounded-[10px] flex items-center justify-center text-amber-200 font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0d0b09] flex items-center justify-center">
                  <span className="w-1 h-1 bg-white rounded-full" />
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate hover:text-amber-300 transition-colors">
                  {user?.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 shadow-sm">
                      <ShieldCheck className="w-2.5 h-2.5 text-amber-400" /> CHIEF WARDEN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 truncate">
                      <GraduationCap className="w-2.5 h-2.5 text-emerald-400" /> {user?.rollNumber || 'SCHOLAR'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu with Warm Gold Glow Transitions */}
        <div className="flex-1 py-4 px-3.5 overflow-y-auto space-y-1.5">
          <div className="px-3 pb-2 flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
              {isAdmin ? 'Administration Hub' : 'Scholar Services'}
            </span>
            <span className="text-[9px] font-mono text-amber-300/80 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded-md">
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
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 shadow-lg shadow-amber-500/25 font-black border border-amber-300/60'
                      : 'text-stone-400 hover:bg-stone-900/80 hover:text-amber-200 hover:translate-x-1'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-stone-950/15 text-stone-950'
                            : 'bg-stone-900 text-stone-400 group-hover:bg-amber-500/15 group-hover:text-amber-400'
                        }`}
                      >
                        <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                      </div>
                      <span className="tracking-tight">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            isActive
                              ? 'bg-stone-950/15 text-stone-950 border-stone-950/25'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive ? (
                        <ChevronRight className="w-4 h-4 text-stone-950" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Live Grid Health Footer Pill */}
        <div className="px-4 py-2 bg-[#080706]/70 border-t border-stone-900">
          <div className="flex items-center justify-between text-[10px] text-stone-400 py-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Campus Grid 100% Online</span>
            </span>
            <span className="font-mono text-amber-400/70">24ms</span>
          </div>
        </div>

        {/* Bottom Actions & Sign Out */}
        <div className="p-3.5 border-t border-stone-800/80 bg-[#080706]/90">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold text-stone-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 border border-stone-800 transition-all duration-200 group"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-stone-500 group-hover:text-rose-400 transition-colors" />
              <span>Disconnect Session</span>
            </div>
            <span className="text-[10px] font-mono text-stone-600 group-hover:text-rose-400">Exit</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
