import React, { useCallback, useRef, useEffect, useState } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { useMemoryOptimization } from '@/hooks/useMemoryOptimization';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface OptimizedVideoPlayerProps {
  src: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  className?: string;
  type?: 'bunny' | 'youtube' | 'direct';
  poster?: string;
  autoplay?: boolean;
}

// مكون محسن للفيديو مع إدارة الذاكرة
const VideoPlayerCore: React.FC<OptimizedVideoPlayerProps> = ({
  src,
  title,
  onProgress,
  onComplete,
  className,
  type = 'direct',
  poster,
  autoplay = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const { clearCache, getCacheStats } = useMemoryOptimization({
    maxCacheSize: 20 // 20MB للفيديو
  });

  // تنظيف الفيديو عند الإنتهاء
  const handleVideoEnd = useCallback(() => {
    onComplete?.();
    
    // تنظيف cache الفيديو
    if (videoRef.current) {
      videoRef.current.src = '';
      videoRef.current.load();
    }
    
    // تنظيف الذاكرة
    clearCache(`video_${src}`);
  }, [onComplete, src, clearCache]);

  // تقرير التقدم مع تحسين الأداء
  const handleProgress = useCallback((progress: number) => {
    onProgress?.(progress);
    
    // تنظيف دوري للذاكرة
    const stats = getCacheStats();
    if (stats.totalSize > 15 * 1024 * 1024) { // 15MB
      clearCache('video_memory');
    }
  }, [onProgress, getCacheStats, clearCache]);

  // تنظيف عند إلغاء التثبيت
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
      clearCache('video_cleanup');
    };
  }, [clearCache]);

  // مراقبة حالة تحميل الفيديو
  const handleLoadStart = useCallback(() => {
    setIsVideoLoaded(false);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Loading overlay */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 bg-muted/20 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-sm text-muted-foreground font-cairo">جاري تحميل الفيديو...</p>
          </div>
        </div>
      )}

      <VideoPlayer
        src={src}
        title={title}
        onProgress={handleProgress}
        onComplete={handleVideoEnd}
        className={className}
        type={type}
        poster={poster}
        autoplay={autoplay}
      />
    </div>
  );
};

// المكون الرئيسي مع Error Boundary
export const OptimizedVideoPlayer: React.FC<OptimizedVideoPlayerProps> = (props) => {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-muted-foreground font-cairo mb-2">
              حدث خطأ في تحميل الفيديو
            </p>
            <button 
              onClick={resetError}
              className="text-primary hover:underline font-cairo text-sm"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}
    >
      <VideoPlayerCore {...props} />
    </ErrorBoundary>
  );
};