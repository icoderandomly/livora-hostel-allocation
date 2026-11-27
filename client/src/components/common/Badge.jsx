import React from 'react';

const BADGE_STYLES = {
  // Room Status
  Available: {
    container: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold',
    dot: 'bg-emerald-400',
    pulse: true,
  },
  Full: {
    container: 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-bold',
    dot: 'bg-rose-400',
    pulse: false,
  },
  Maintenance: {
    container: 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-bold',
    dot: 'bg-amber-400',
    pulse: false,
  },

  // Application Status
  Pending: {
    container: 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-bold',
    dot: 'bg-amber-400',
    pulse: true,
  },
  Approved: {
    container: 'bg-yellow-500/15 text-yellow-200 border-yellow-500/40 font-bold',
    dot: 'bg-yellow-400',
    pulse: false,
  },
  Rejected: {
    container: 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-bold',
    dot: 'bg-rose-400',
    pulse: false,
  },
  Allocated: {
    container: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold',
    dot: 'bg-emerald-400',
    pulse: false,
  },

  // Allocation Status
  Active: {
    container: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold',
    dot: 'bg-emerald-400',
    pulse: true,
  },
  Vacated: {
    container: 'bg-stone-800/70 text-stone-300 border-stone-700 font-medium',
    dot: 'bg-stone-400',
    pulse: false,
  },
  Transferred: {
    container: 'bg-orange-500/15 text-orange-300 border-orange-500/40 font-medium',
    dot: 'bg-orange-400',
    pulse: false,
  },

  // Roles
  ADMIN: {
    container: 'bg-amber-500/20 text-amber-200 border-amber-400/50 font-extrabold tracking-wide',
    dot: 'bg-amber-400',
    pulse: false,
  },
  STUDENT: {
    container: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-semibold',
    dot: 'bg-emerald-400',
    pulse: false,
  },

  // Hostel Types
  Boys: {
    container: 'bg-amber-500/20 text-amber-200 border-amber-500/40 font-bold',
    dot: 'bg-amber-400',
    pulse: false,
  },
  Girls: {
    container: 'bg-rose-500/20 text-rose-200 border-rose-500/40 font-bold',
    dot: 'bg-rose-400',
    pulse: false,
  },
  'Co-ed': {
    container: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40 font-bold',
    dot: 'bg-emerald-400',
    pulse: false,
  },
};

export const Badge = ({ status, className = '', children }) => {
  const displayValue = children || status;
  const config = BADGE_STYLES[status] || {
    container: 'bg-stone-800 text-stone-300 border-stone-700 font-medium',
    dot: 'bg-stone-400',
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
