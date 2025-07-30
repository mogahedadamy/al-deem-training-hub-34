import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react';
import { useLearningProgress } from '@/contexts/LearningProgressContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BunnyVideoPlayerProps {
  videoUrl: string;
  lessonId?: string;
  title?: string;
  autoPlay?: boolean;
  onProgress?: (currentTime: number, duration: number) => void;
}

export const BunnyVideoPlayer: React.FC<BunnyVideoPlayerProps> = ({ 
  videoUrl, 
  lessonId,
  title, 
  autoPlay = false,
  onProgress 
}) => {
  const { updateVideoProgress, getLessonProgress } = useLearningProgress();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [lastProgressUpdate, setLastProgressUpdate] = useState(0);
  
  // Get initial progress from context
  const lessonProgress = lessonId ? getLessonProgress(lessonId) : null;
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const total = video.duration;
      setCurrentTime(current);
      
      if (total > 0) {
        const progressPercent = (current / total) * 100;
        
        // Update progress in context every 30 seconds or on significant progress jumps
        if (lessonId && (current - lastProgressUpdate > 30 || progressPercent - (lessonProgress?.watchedPercentage || 0) > 5)) {
          updateVideoProgress(lessonId, progressPercent);
          setLastProgressUpdate(current);
        }
        
        // Call external progress callback
        onProgress?.(current, total);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Mark lesson as complete when video ends
      if (lessonId) {
        updateVideoProgress(lessonId, 100);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Set initial progress if available
    if (lessonProgress?.watchedPercentage && lessonProgress.watchedPercentage > 0) {
      video.addEventListener('loadedmetadata', () => {
        const resumeTime = (lessonProgress.watchedPercentage / 100) * video.duration;
        if (resumeTime > 10) { // Only resume if more than 10 seconds
          video.currentTime = resumeTime;
        }
      });
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      
      // Save final progress when component unmounts
      if (lessonId && video.currentTime > 0 && video.duration > 0) {
        const finalProgress = (video.currentTime / video.duration) * 100;
        updateVideoProgress(lessonId, finalProgress);
      }
    };
  }, [videoUrl, lessonId, lastProgressUpdate, lessonProgress]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const seekTime = (value[0] / 100) * duration;
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
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
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const handlePlaybackRateChange = (rate: string) => {
    const video = videoRef.current;
    if (!video) return;

    const newRate = parseFloat(rate);
    video.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
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

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden group aspect-video"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay={autoPlay}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      {/* Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[progressPercentage]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => skip(-10)}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => skip(10)}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 ml-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            <span className="text-white text-sm ml-4">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Select value={playbackRate.toString()} onValueChange={handlePlaybackRateChange}>
              <SelectTrigger className="w-20 h-8 text-white border-white/20 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.25">0.25x</SelectItem>
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
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlay}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4"
          >
            <Play className="w-12 h-12" />
          </Button>
        </div>
      )}

      {/* Title Overlay */}
      {title && (
        <div className="absolute top-4 left-4 right-4">
          <h3 className="text-white text-lg font-semibold font-cairo bg-black/50 px-3 py-2 rounded">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
};