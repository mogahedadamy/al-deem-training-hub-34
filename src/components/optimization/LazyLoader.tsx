import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components
export const LazyVideoPlayer = lazy(() => import('@/components/video/AdvancedVideoPlayer').then(module => ({ default: module.AdvancedVideoPlayer })));
export const LazyDashboard = lazy(() => import('@/components/dashboard/Dashboard').then(module => ({ default: module.Dashboard })));
export const LazyCourseDetail = lazy(() => import('@/pages/CourseDetail'));

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback,
  minHeight = "200px" 
}) => {
  const defaultFallback = (
    <div className="space-y-4 p-4" style={{ minHeight }}>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-32 w-full" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

// Performance optimized image component
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = React.memo(({
  src,
  alt,
  className,
  width,
  height,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <Skeleton 
          className="absolute inset-0" 
          style={{ width, height }} 
        />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';