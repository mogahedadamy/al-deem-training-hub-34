import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface BunnyPlayerProps {
  videoUrl: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  className?: string;
  poster?: string;
}

export const BunnyPlayer = ({ 
  videoUrl, 
  title, 
  onProgress, 
  onComplete, 
  className,
  poster 
}: BunnyPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progress = (video.currentTime / video.duration) * 100;
      onProgress?.(progress);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      video.muted = false;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!isFullscreen) {
      container.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <div 
      className={cn(
        "relative bg-black rounded-lg overflow-hidden group cursor-pointer",
        className
      )}
      onMouseMove={showControlsTemporarily}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        onClick={togglePlay}
        onContextMenu={(e) => e.preventDefault()} // منع النقر بالزر الأيمن
      >
        <source src={videoUrl} type="video/mp4" />
        المتصفح لا يدعم تشغيل الفيديو
      </video>

      {/* شاشة التحميل */}
      {!duration && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* أدوات التحكم - محسنة للجوال */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300",
          "p-2 md:p-4",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* شريط التقدم */}
        <div className="mb-2 md:mb-4">
          <Slider
            value={[duration ? (currentTime / duration) * 100 : 0]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full cursor-pointer h-2 md:h-auto"
          />
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-1 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="text-white hover:text-primary p-1 md:p-2 h-8 w-8 md:h-10 md:w-10"
            >
              {isPlaying ? <Pause size={16} className="md:w-5 md:h-5" /> : <Play size={16} className="md:w-5 md:h-5" />}
            </Button>

            <span className="text-white text-xs md:text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:text-primary p-1 md:p-2 h-8 w-8 md:h-10 md:w-10"
            >
              {isMuted ? <VolumeX size={14} className="md:w-4 md:h-4" /> : <Volume2 size={14} className="md:w-4 md:h-4" />}
            </Button>
            
            {/* مخفي على الجوال لتوفير المساحة */}
            <div className="hidden md:block w-20">
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:text-primary p-1 md:p-2 h-8 w-8 md:h-10 md:w-10"
            >
              <Maximize size={14} className="md:w-4 md:h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* زر التشغيل المركزي */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-primary/80 hover:bg-primary text-white"
          >
            <Play size={24} fill="white" />
          </Button>
        </div>
      )}
    </div>
  );
};