import React from 'react';

const BADGE_STYLES = {
  // Room Status
  Available: {
    container: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold',
    dot: 'bg-emerald-400',
    pulse: true,
  },
  Full: {
    container: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold',
    dot: 'bg-rose-400',
    pulse: false,
  },
  Maintenance: {
    container: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold',
    dot: 'bg-amber-400',
    pulse: false,
  },

  // Application Status
  Pending: {
    container: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold',
    dot: 'bg-amber-400',
    pulse: true,
  },
  Approved: {
    container: 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold',
    dot: 'bg-sky-400',
    pulse: false,
  },
  Rejected: {
    container: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold',
    dot: 'bg-rose-400',
    pulse: false,
  },
  Allocated: {
    container: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold',
    dot: 'bg-indigo-400',
    pulse: false,
  },

  // Allocation Status
  Active: {
    container: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold',
    dot: 'bg-emerald-400',
    pulse: true,
  },
  Vacated: {
    container: 'bg-slate-700/40 text-slate-300 border-slate-600/40 font-medium',
    dot: 'bg-slate-400',
    pulse: false,
  },
  Transferred: {
    container: 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-medium',
    dot: 'bg-purple-400',
    pulse: false,
  },

  // Roles
  ADMIN: {
    container: 'bg-blue-600/25 text-sky-300 border-blue-500/40 font-extrabold tracking-wide',
    dot: 'bg-sky-400',
    pulse: false,
  },
  STUDENT: {
    container: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold',
    dot: 'bg-cyan-400',
    pulse: false,
  },

  // Hostel Types
  Boys: {
    container: 'bg-blue-500/20 text-sky-300 border-blue-500/40 font-bold',
    dot: 'bg-sky-400',
    pulse: false,
  },
  Girls: {
    container: 'bg-pink-500/20 text-pink-300 border-pink-500/40 font-bold',
    dot: 'bg-pink-400',
    pulse: false,
  },
  'Co-ed': {
    container: 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold',
    dot: 'bg-purple-400',
    pulse: false,
  },
};

export const Badge = ({ status, className = '', children }) => {
  const displayValue = children || status;
  const config = BADGE_STYLES[status] || {
    container: 'bg-slate-800 text-slate-300 border-slate-700 font-medium',
    dot: 'bg-slate-400',
    pulse: false,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border backdrop-blur-md shadow-xs transition-all ${config.container} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {config.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`} />
      </span>
      <span>{displayValue}</span>
    </span>
  );
};

export default Badge;
