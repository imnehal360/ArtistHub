import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm">
      {/* Image Skeleton */}
      <div className="shimmer h-64 w-full" />
      
      {/* Details Skeleton */}
      <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="shimmer h-6 w-6 rounded-full" />
          <div className="shimmer h-3 w-20 rounded" />
        </div>
        <div className="shimmer h-6 w-6 rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonCard;
export const SkeletonPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="shimmer h-12 w-1/3 rounded-xl mb-6" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};
