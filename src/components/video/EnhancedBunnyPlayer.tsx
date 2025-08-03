import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  SkipBack, 
  SkipForward,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { enhancedBunnyService } from '@/services/enhancedBunnyService';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useNetworkOptimization } from '@/hooks/useNetworkOptimization';
import { useResourceOptimization } from '@/hooks/useResourceOptimization';
import { cn } from '@/lib/utils';

interface VideoQuality {
  resolution: string;
  bitrate: number;
  url: string;
}

interface EnhancedBunnyPlayerProps {
  videoId: string;
  lessonId?: string;
  title?: string;
  autoPlay?: boolean;
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
  className?: string;
}

export const EnhancedBunnyPlayer: React.FC<EnhancedBunnyPlayerProps> = ({
  videoId,
  lessonId,
  title,
  autoPlay = false,
  onProgress,
  onComplete,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isMobile, isTablet, orientation } = useMobileDetection();
  const { getNetworkScore, networkState } = useNetworkOptimization();
  const { optimizeVideo } = useResourceOptimization();

  // حالات الفيديو
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // حالات الجودة والشبكة
  const [availableQualities, setAvailableQualities] = useState<VideoQuality[]>([]);
  const [currentQuality, setCurrentQuality] = useState<VideoQuality | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showQualitySelector, setShowQualitySelector] = useState(false);

  // مراجع
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const progressUpdateRef = useRef<NodeJS.Timeout>();

  // تحميل جودات الفيديو المتاحة
  useEffect(() => {
    const loadVideoQualities = async () => {
      try {
        setIsLoading(true);
        const qualities = await enhancedBunnyService.getVideoQualities(videoId);
        setAvailableQualities(qualities);

        // اختيار الجودة المناسبة
        const networkScore = getNetworkScore();
        const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
        const optimalQuality = enhancedBunnyService.selectOptimalQuality(
          qualities,
          networkScore / 20, // تحويل النقاط إلى Mbps تقريبي
          deviceType
        );

        setCurrentQuality(optimalQuality);
      } catch (error) {
        console.error('Error loading video qualities:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoQualities();
  }, [videoId, isMobile, isTablet, getNetworkScore]);

  // تحديث URL الفيديو عند تغيير الجودة
  useEffect(() => {
    if (currentQuality && videoRef.current) {
      const optimizedUrl = enhancedBunnyService.optimizeVideoUrl(currentQuality.url, {
        quality: currentQuality.resolution,
        autoplay: autoPlay,
        preload: 'metadata',
        enableHLS: true
      });

      videoRef.current.src = optimizeVideo(optimizedUrl);
    }
  }, [currentQuality, autoPlay, optimizeVideo]);

  // إدارة التشغيل/الإيقاف
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  }, [isPlaying]);

  // إدارة مستوى الصوت
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  // إدارة ملء الشاشة
  const toggleFullscreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  // تغيير الجودة
  const changeQuality = useCallback((qualityRes: string) => {
    const quality = availableQualities.find(q => q.resolution === qualityRes);
    if (quality && quality !== currentQuality) {
      const currentTime = videoRef.current?.currentTime || 0;
      setCurrentQuality(quality);
      
      // الحفاظ على الوقت الحالي
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
        }
      }, 100);
    }
  }, [availableQualities, currentQuality]);

  // إدارة إخفاء الضوابط
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  // معالجات الأحداث
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
      setIsLoading(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
      
      // تحديث التقدم كل ثانية
      if (onProgress && Math.floor(video.currentTime) !== Math.floor(currentTime)) {
        onProgress(video.currentTime, video.duration);
      }

      // تسجيل المشاهدة مع Bunny
      if (progressUpdateRef.current) {
        clearTimeout(progressUpdateRef.current);
      }
      
      progressUpdateRef.current = setTimeout(() => {
        enhancedBunnyService.recordView(videoId, video.currentTime);
      }, 5000); // كل 5 ثوان
    }
  }, [onProgress, currentTime, videoId]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setIsBuffering(false);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsBuffering(false);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
    // تسجيل الإكمال
    enhancedBunnyService.recordView(videoId, duration);
  }, [onComplete, videoId, duration]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  // ربط معالجات الأحداث
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [
    handleLoadedMetadata,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleWaiting,
    handleCanPlay,
    handleEnded,
    handleError
  ]);

  // تنظيف
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (progressUpdateRef.current) {
        clearTimeout(progressUpdateRef.current);
      }
    };
  }, []);

  // تصيير حالة الخطأ
  if (hasError) {
    return (
      <div className={cn("aspect-video bg-muted rounded-lg flex items-center justify-center", className)}>
        <div className="text-center p-4">
          <WifiOff className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground font-cairo">حدث خطأ في تحميل الفيديو</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 font-cairo"
            onClick={() => window.location.reload()}
          >
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={cn(
        "relative group aspect-video bg-black rounded-lg overflow-hidden",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* مشغل الفيديو */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        preload="metadata"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-sm font-cairo">جاري تحميل الفيديو...</p>
          </div>
        </div>
      )}

      {/* Buffering Indicator */}
      {isBuffering && !isLoading && (
        <div className="absolute top-4 right-4 bg-black/50 rounded-lg p-2">
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        </div>
      )}

      {/* Network Status */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        {networkState.isOnline ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        {currentQuality && (
          <span className="text-xs bg-black/50 text-white px-2 py-1 rounded font-cairo">
            {currentQuality.resolution}
          </span>
        )}
      </div>

      {/* Video Controls */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={([value]) => {
              if (videoRef.current) {
                videoRef.current.currentTime = value;
                setCurrentTime(value);
              }
            }}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/70 mt-1 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>

            <div className="w-24 mx-2">
              <Slider
                value={[volume]}
                max={1}
                step={0.1}
                onValueChange={([value]) => {
                  setVolume(value);
                  if (videoRef.current) {
                    videoRef.current.volume = value;
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quality Selector */}
            <Select value={currentQuality?.resolution} onValueChange={changeQuality}>
              <SelectTrigger className="w-20 bg-black/50 border-white/20 text-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableQualities.map((quality) => (
                  <SelectItem key={quality.resolution} value={quality.resolution}>
                    {quality.resolution}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Playback Speed */}
            <Select value={playbackRate.toString()} onValueChange={(value) => {
              const rate = parseFloat(value);
              setPlaybackRate(rate);
              if (videoRef.current) {
                videoRef.current.playbackRate = rate;
              }
            }}>
              <SelectTrigger className="w-16 bg-black/50 border-white/20 text-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="0.75">0.75x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.25">1.25x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Center Play Button */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <Play className="w-8 h-8 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};