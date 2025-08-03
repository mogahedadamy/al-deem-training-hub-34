import React, { useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = React.memo(({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  fallback,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // تحسين رابط الصورة حسب الحجم المطلوب
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    // إذا كانت الصورة من Supabase، نضيف معاملات التحسين
    if (originalSrc.includes('supabase')) {
      const url = new URL(originalSrc);
      if (width) url.searchParams.set('width', width.toString());
      if (height) url.searchParams.set('height', height.toString());
      url.searchParams.set('quality', '80');
      url.searchParams.set('format', 'webp');
      return url.toString();
    }
    return originalSrc;
  }, [width, height]);

  const optimizedSrc = getOptimizedSrc(src);

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {!isLoaded && !hasError && (
        <Skeleton 
          className="absolute inset-0 w-full h-full" 
        />
      )}
      
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // تحسين لمتصفحات Chrome
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';