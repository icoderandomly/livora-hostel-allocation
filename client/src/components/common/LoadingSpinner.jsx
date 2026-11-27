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
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-amber-500/25 border-t-amber-400 animate-spin`}
      />
      {text && <p className="text-sm font-medium text-stone-400">{text}</p>}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full animate-pulse space-y-3">
      <div className="h-10 bg-stone-900/90 rounded-xl w-full border border-stone-800" />
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          {[...Array(cols)].map((_, j) => (
            <div
              key={j}
              className="h-8 bg-stone-900/60 rounded-xl flex-1 border border-stone-800/60"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
