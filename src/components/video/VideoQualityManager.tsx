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
    
    // Find matching quality or fallback to closest available
    const matchingQuality = videoQualities.find(q => 
      q.resolution.toLowerCase().includes(recommendedQuality.toLowerCase())
    );
    
    if (matchingQuality) return matchingQuality;
    
    // Fallback logic based on network state
    if (!networkState.isOnline) return videoQualities[videoQualities.length - 1]; // Lowest quality
    
    if (networkState.saveData) {
      return videoQualities.find(q => q.resolution.includes('360p')) || videoQualities[videoQualities.length - 1];
    }
    
    if (networkState.downlink > 10) {
      return videoQualities.find(q => q.resolution.includes('1080p')) || videoQualities[0];
    } else if (networkState.downlink > 5) {
      return videoQualities.find(q => q.resolution.includes('720p')) || videoQualities[0];
    } else {
      return videoQualities.find(q => q.resolution.includes('480p')) || videoQualities[videoQualities.length - 1];
    }
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