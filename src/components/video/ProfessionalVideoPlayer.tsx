import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  SkipBack, 
  SkipForward,
  MoreHorizontal,
  Download,
  Share2
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface VideoQuality {
  label: string;
  value: string;
  url: string;
  resolution: string;
}

interface ProfessionalVideoPlayerProps {
  videoQualities: VideoQuality[];
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onSeek?: (time: number) => void;
  className?: string;
  poster?: string;
  autoplay?: boolean;
  startTime?: number;
  initialQuality?: VideoQuality;
}

export const ProfessionalVideoPlayer = ({
  videoQualities,
  title,
  onProgress,
  onComplete,
  onSeek,
  className,
  poster,
  autoplay = false,
  startTime = 0,
  initialQuality
}: ProfessionalVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const progressBarRef = useRef<HTMLDivElement>(null);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentQuality, setCurrentQuality] = useState(initialQuality || videoQualities[0]);
  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferedRanges, setBufferedRanges] = useState<{start: number, end: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Format time display
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update buffered ranges
  const updateBufferedRanges = useCallback(() => {
    if (!videoRef.current) return;
    
    const buffered = videoRef.current.buffered;
    const ranges: {start: number, end: number}[] = [];
    
    for (let i = 0; i < buffered.length; i++) {
      ranges.push({
        start: buffered.start(i),
        end: buffered.end(i)
      });
    }
    
    setBufferedRanges(ranges);
  }, []);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      if (startTime > 0) {
        video.currentTime = startTime;
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progress = (video.currentTime / video.duration) * 100;
      onProgress?.(progress);
      updateBufferedRanges();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleProgress = () => updateBufferedRanges();

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('progress', handleProgress);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('progress', handleProgress);
    };
  }, [onProgress, onComplete, startTime, updateBufferedRanges]);

  // Quality change handler
  const handleQualityChange = (quality: VideoQuality) => {
    if (!videoRef.current) return;
    
    const currentTimeBeforeChange = videoRef.current.currentTime;
    const wasPlaying = !videoRef.current.paused;
    
    setCurrentQuality(quality);
    videoRef.current.src = quality.url;
    
    videoRef.current.addEventListener('loadeddata', () => {
      videoRef.current!.currentTime = currentTimeBeforeChange;
      if (wasPlaying) {
        videoRef.current!.play();
      }
    }, { once: true });
  };

  // Control handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    
    const newTime = (value[0] / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    onSeek?.(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    videoRef.current.currentTime = newTime;
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (!videoRef.current) return;
    
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
  };

  // Fullscreen handlers
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Controls visibility
  const showControlsTemporarily = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange([Math.min(100, (volume * 100) + 10)]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange([Math.max(0, (volume * 100) - 10)]);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, volume, duration, currentTime]);

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      ref={containerRef}
      className={cn("relative bg-black rounded-lg overflow-hidden group", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      tabIndex={0}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={currentQuality.url}
        poster={poster}
        autoPlay={autoplay}
        playsInline
        preload="metadata"
      />

      {/* Loading Spinner */}
      {(isLoading || isBuffering) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Central Play Button */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={togglePlay}
            size="lg"
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0 transition-all duration-300 hover:scale-110"
          >
            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
          </Button>
        </div>
      )}

      {/* Controls Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <h3 className="text-white font-medium text-lg font-cairo truncate flex-1">{title}</h3>
          
          <div className="flex items-center gap-2">
            {/* Quality Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-8 px-2"
                >
                  <Settings className="w-4 h-4" />
                  <span className="ml-1 text-xs">{currentQuality.resolution}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>جودة الفيديو</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {videoQualities.map((quality) => (
                  <DropdownMenuItem
                    key={quality.value}
                    onClick={() => handleQualityChange(quality)}
                    className={cn(
                      "cursor-pointer",
                      currentQuality.value === quality.value && "bg-accent"
                    )}
                  >
                    {quality.label} ({quality.resolution})
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>سرعة التشغيل</DropdownMenuLabel>
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                  <DropdownMenuItem
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={cn(
                      "cursor-pointer",
                      playbackRate === rate && "bg-accent"
                    )}
                  >
                    {rate === 1 ? 'عادي' : `${rate}x`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Share2 className="w-4 h-4 ml-2" />
                  مشاركة
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="relative">
              {/* Buffered Ranges */}
              <div className="absolute inset-0 bg-white/20 rounded-full h-1">
                {bufferedRanges.map((range, index) => (
                  <div
                    key={index}
                    className="absolute bg-white/40 h-1 rounded-full"
                    style={{
                      left: `${(range.start / duration) * 100}%`,
                      width: `${((range.end - range.start) / duration) * 100}%`
                    }}
                  />
                ))}
              </div>
              
              {/* Progress Slider */}
              <Slider
                value={[progressPercentage]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 h-10 w-10 p-0"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5" fill="currentColor" />
                )}
              </Button>

              {/* Skip Buttons */}
              <Button
                onClick={() => skip(-10)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => skip(10)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              {/* Volume Controls */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>

                {/* Volume Slider */}
                <div 
                  className={cn(
                    "transition-all duration-200 overflow-hidden",
                    showVolumeSlider ? "w-20 opacity-100" : "w-0 opacity-0"
                  )}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Time Display */}
              <span className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Fullscreen */}
              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Click to play/pause */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlay}
        style={{ zIndex: showControls ? -1 : 1 }}
      />
    </div>
  );
};