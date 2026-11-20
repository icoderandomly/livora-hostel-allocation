import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-indigo-500/30 border-t-indigo-400 animate-spin`}
      />
      {text && <p className="text-sm font-medium text-slate-400">{text}</p>}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full animate-pulse space-y-3">
      <div className="h-10 bg-indigo-950/60 rounded-xl w-full border border-indigo-900/30" />
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          {[...Array(cols)].map((_, j) => (
            <div
              key={j}
              className="h-8 bg-indigo-950/40 rounded-xl flex-1 border border-indigo-900/20"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
