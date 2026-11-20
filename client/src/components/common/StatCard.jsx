import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'indigo',
}) => {
  const colorMap = {
    indigo: {
      iconBg: 'bg-blue-500/15 text-sky-400 border-blue-500/30',
      accent: 'from-blue-600 via-indigo-600 to-sky-400',
    },
    emerald: {
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      accent: 'from-emerald-500 to-teal-400',
    },
    amber: {
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      accent: 'from-amber-500 to-yellow-400',
    },
    rose: {
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      accent: 'from-rose-500 to-pink-500',
    },
    blue: {
      iconBg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      accent: 'from-sky-500 to-blue-600',
    },
    purple: {
      iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      accent: 'from-purple-500 to-indigo-500',
    },
  };

  const currentTheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="group relative bg-[#0c1429]/90 backdrop-blur-xl rounded-3xl p-6 border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.25)] hover:border-indigo-400/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Top accent glow bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${currentTheme.accent} opacity-80 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-2xl border ${currentTheme.iconBg} shadow-inner transition-transform group-hover:scale-110 duration-200`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3.5 border-t border-indigo-950/80 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-300 font-medium">{subtitle}</span>}
          {trend && (
            <span className="font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
