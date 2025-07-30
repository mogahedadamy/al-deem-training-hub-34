import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface VideoQuality {
  label: string;
  value: string;
  url: string;
  resolution: string;
}

interface AdvancedVideoPlayerProps {
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

export const AdvancedVideoPlayer = ({
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
}: AdvancedVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState(initialQuality || videoQualities[0] || null);

  // Control visibility timer
  const controlsTimerRef = useRef<NodeJS.Timeout>();

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      if (startTime > 0) {
        video.currentTime = startTime;
      }
      if (autoplay) {
        video.play().catch(console.error);
        setIsPlaying(true);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onProgress?.(video.currentTime);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [selectedQuality, autoplay, startTime, onProgress, onComplete]);

  // Quality change handler
  const handleQualityChange = useCallback((quality: VideoQuality) => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;

    setSelectedQuality(quality);
    setIsLoading(true);

    // Wait for video to load new source
    const handleLoadedData = () => {
      video.currentTime = currentTime;
      if (wasPlaying) {
        video.play().catch(console.error);
      }
      video.removeEventListener('loadeddata', handleLoadedData);
    };

    video.addEventListener('loadeddata', handleLoadedData);
  }, []);

  // Playback controls
  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  }, []);

  const handleSeekChange = useCallback((value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    onSeek?.(newTime);
  }, [duration, onSeek]);

  const handleVolumeChange = useCallback((value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }, []);

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    video.currentTime = newTime;
    setCurrentTime(newTime);
  }, [currentTime, duration]);

  const changePlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, []);

  // Controls visibility
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative bg-black rounded-lg overflow-hidden group", className)}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        src={selectedQuality?.url}
        onContextMenu={(e) => e.preventDefault()}
        onClick={togglePlay}
        playsInline
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      )}

      {/* Central Play Button */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={togglePlay}
            size="lg"
            className="w-20 h-20 rounded-full bg-primary/90 hover:bg-primary text-white shadow-2xl"
          >
            <Play className="w-8 h-8 ml-1" />
          </Button>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="relative">
            {/* Buffer Bar */}
            <div className="absolute inset-0 bg-white/20 rounded-full h-1">
              <div
                className="bg-white/40 h-full rounded-full transition-all duration-300"
                style={{ width: `${buffered}%` }}
              />
            </div>
            {/* Progress Slider */}
            <Slider
              value={[duration ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeekChange}
              max={100}
              step={0.1}
              className="relative z-10"
            />
          </div>
          <div className="flex justify-between text-xs text-white/80 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Play/Pause */}
            <Button
              onClick={togglePlay}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 p-2"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            {/* Skip Buttons */}
            <Button
              onClick={() => skip(-10)}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 p-2"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => skip(10)}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 p-2"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleMute}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Speed Control */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 text-xs">
                  {playbackRate}x
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <DropdownMenuItem
                    key={rate}
                    onClick={() => changePlaybackRate(rate)}
                    className={rate === playbackRate ? "bg-primary/20" : ""}
                  >
                    {rate}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quality Selector */}
            {videoQualities.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {videoQualities.map((quality) => (
                    <DropdownMenuItem
                      key={quality.value}
                      onClick={() => handleQualityChange(quality)}
                      className={quality.value === selectedQuality?.value ? "bg-primary/20" : ""}
                    >
                      {quality.label} ({quality.resolution})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Fullscreen */}
            <Button
              onClick={toggleFullscreen}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 p-2"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};