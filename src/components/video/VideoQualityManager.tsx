import React, { useMemo } from 'react';
import { ProfessionalVideoPlayer } from './ProfessionalVideoPlayer';
import { useNetworkOptimization } from '@/hooks/useNetworkOptimization';

interface VideoSource {
  url: string;
  quality?: string;
  resolution?: string;
  type?: 'mp4' | 'hls' | 'dash';
}

interface VideoQualityManagerProps {
  sources: VideoSource[];
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onSeek?: (time: number) => void;
  className?: string;
  poster?: string;
  autoplay?: boolean;
  startTime?: number;
}

export const VideoQualityManager = ({
  sources,
  title,
  onProgress,
  onComplete,
  onSeek,
  className,
  poster,
  autoplay = false,
  startTime = 0
}: VideoQualityManagerProps) => {
  const { getRecommendedVideoQuality, networkState } = useNetworkOptimization();
  
  // Convert sources to quality options
  const videoQualities = useMemo(() => {
    return sources.map((source, index) => ({
      label: source.quality || `جودة ${index + 1}`,
      value: source.quality || `quality_${index}`,
      url: source.url,
      resolution: source.resolution || 'غير محدد',
      type: source.type || 'mp4'
    }));
  }, [sources]);

  // Auto-detect best quality based on network optimization hook
  const getOptimalQuality = () => {
    const recommendedQuality = getRecommendedVideoQuality();
    
    // Default to medium quality instead of highest for better performance
    let optimalQuality = videoQualities.find(q => 
      q.resolution.includes('720p') || q.resolution.includes('480p')
    ) || videoQualities[Math.floor(videoQualities.length / 2)]; // Default to middle quality
    
    // Fallback logic based on network state
    if (!networkState.isOnline) {
      return videoQualities[videoQualities.length - 1]; // Lowest quality
    }
    
    if (networkState.saveData) {
      return videoQualities.find(q => q.resolution.includes('360p')) || videoQualities[videoQualities.length - 1];
    }
    
    // More conservative quality selection based on connection speed
    if (networkState.downlink > 15) {
      optimalQuality = videoQualities.find(q => q.resolution.includes('1080p')) || videoQualities[0];
    } else if (networkState.downlink > 8) {
      optimalQuality = videoQualities.find(q => q.resolution.includes('720p')) || optimalQuality;
    } else if (networkState.downlink > 3) {
      optimalQuality = videoQualities.find(q => q.resolution.includes('480p')) || optimalQuality;
    } else {
      optimalQuality = videoQualities.find(q => q.resolution.includes('360p')) || videoQualities[videoQualities.length - 1];
    }
    
    return optimalQuality;
  };

  // Sort qualities by resolution (highest first)
  const sortedQualities = useMemo(() => {
    return [...videoQualities].sort((a, b) => {
      const resolutionA = parseInt(a.resolution.match(/\d+/)?.[0] || '0');
      const resolutionB = parseInt(b.resolution.match(/\d+/)?.[0] || '0');
      return resolutionB - resolutionA;
    });
  }, [videoQualities]);

  if (sortedQualities.length === 0) {
    return (
      <div className="bg-black rounded-lg aspect-video flex items-center justify-center text-white">
        <p>لا توجد مصادر فيديو متاحة</p>
      </div>
    );
  }

  // Set initial quality based on network optimization
  const initialQuality = getOptimalQuality();

  return (
    <ProfessionalVideoPlayer
      videoQualities={sortedQualities}
      title={title}
      onProgress={onProgress}
      onComplete={onComplete}
      onSeek={onSeek}
      className={className}
      poster={poster}
      autoplay={autoplay}
      startTime={startTime}
      initialQuality={initialQuality}
    />
  );
};