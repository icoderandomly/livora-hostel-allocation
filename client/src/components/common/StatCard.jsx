import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'amber',
}) => {
  const colorMap = {
    indigo: {
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      accent: 'from-amber-500 via-yellow-400 to-orange-400',
    },
    emerald: {
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      accent: 'from-emerald-500 to-lime-400',
    },
    amber: {
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      accent: 'from-amber-400 via-yellow-400 to-orange-500',
    },
    rose: {
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      accent: 'from-rose-500 to-orange-500',
    },
    blue: {
      iconBg: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
      accent: 'from-orange-500 to-amber-400',
    },
    purple: {
      iconBg: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
      accent: 'from-yellow-400 to-amber-600',
    },
  };

  const currentTheme = colorMap[color] || colorMap.amber;

  return (
    <div className="glass-card glass-card-hover group rounded-3xl p-6">
      {/* Top accent glow bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${currentTheme.accent} opacity-85 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-2xl border ${currentTheme.iconBg} shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3.5 border-t border-stone-800/80 flex items-center justify-between text-xs">
          {subtitle && <span className="text-stone-300 font-medium">{subtitle}</span>}
          {trend && (
            <span className="font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
