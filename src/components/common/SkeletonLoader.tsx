import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-shimmer bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]';

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
      default:
        return 'rounded-lg';
    }
  };

  const getSizeClasses = () => {
    const widthClass = width ? (typeof width === 'number' ? `w-${width}` : `w-[${width}]`) : '';
    const heightClass = height ? (typeof height === 'number' ? `h-${height}` : `h-[${height}]`) : '';

    if (variant === 'text') {
      return heightClass || 'h-4';
    }

    return cn(widthClass, heightClass);
  };

  if (lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              getVariantClasses(),
              getSizeClasses(),
              'w-full'
            )}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
    />
  );
};

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="glassmorphism rounded-xl p-6">
      <SkeletonLoader variant="text" width="w-1/3" height="h-8" className="mb-2" />
      <SkeletonLoader variant="text" width="w-1/2" height="h-4" />
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="glassmorphism rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <SkeletonLoader variant="text" width="w-16" height="h-4" />
              <SkeletonLoader variant="text" width="w-12" height="h-8" />
            </div>
            <SkeletonLoader variant="circular" width="w-8" height="h-8" />
          </div>
        </div>
      ))}
    </div>

    {/* Content Sections Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="glassmorphism rounded-xl p-6">
          <SkeletonLoader variant="text" width="w-1/3" height="h-6" className="mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <SkeletonLoader variant="circular" width="w-5" height="h-5" />
                  <div className="space-y-1">
                    <SkeletonLoader variant="text" width="w-20" height="h-4" />
                    <SkeletonLoader variant="text" width="w-16" height="h-3" />
                  </div>
                </div>
                <div className="space-y-1">
                  <SkeletonLoader variant="text" width="w-12" height="h-4" />
                  <SkeletonLoader variant="text" width="w-16" height="h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const FeaturesSkeleton: React.FC = () => (
  <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative bg-gray-900/50">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <SkeletonLoader variant="text" width="w-1/2" height="h-12" className="mx-auto mb-6" />
        <SkeletonLoader variant="text" width="w-2/3" height="h-6" className="mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="glassmorphism rounded-xl p-8"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <SkeletonLoader variant="circular" width="w-16" height="h-16" className="mb-6" />
            <SkeletonLoader variant="text" width="w-3/4" height="h-6" className="mb-4" />
            <div className="space-y-2">
              <SkeletonLoader variant="text" width="w-full" height="h-4" />
              <SkeletonLoader variant="text" width="w-5/6" height="h-4" />
              <SkeletonLoader variant="text" width="w-4/5" height="h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SkeletonLoader;
