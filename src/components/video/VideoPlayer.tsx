import { BunnyPlayer } from './BunnyPlayer';
import { YouTubePlayer } from './YouTubePlayer';
import { VideoQualityManager } from './VideoQualityManager';
import { useNetworkOptimization } from '@/hooks/useNetworkOptimization';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  className?: string;
  type?: 'bunny' | 'youtube' | 'direct';
  poster?: string;
  qualities?: Array<{
    url: string;
    quality: string;
    resolution: string;
  }>;
  autoplay?: boolean;
}

export const VideoPlayer = ({ 
  src, 
  title, 
  onProgress, 
  onComplete, 
  className,
  type = 'direct',
  poster,
  qualities,
  autoplay = false
}: VideoPlayerProps) => {
  const { getRecommendedVideoQuality } = useNetworkOptimization();
  // تحديد نوع المشغل حسب الرابط إذا لم يتم تحديده
  const getPlayerType = () => {
    if (type !== 'direct') return type;
    
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      return 'youtube';
    }
    
    if (src.includes('b-cdn.net') || src.includes('bunnycdn.com')) {
      return 'bunny';
    }
    
    return 'direct';
  };

  const playerType = getPlayerType();

  // مشغل YouTube
  if (playerType === 'youtube') {
    return (
      <YouTubePlayer
        videoUrl={src}
        title={title}
        onProgress={onProgress}
        onComplete={onComplete}
        className={className}
      />
    );
  }

  // مشغل Bunny.net
  if (playerType === 'bunny') {
    return (
      <BunnyPlayer
        videoUrl={src}
        title={title}
        onProgress={onProgress}
        onComplete={onComplete}
        className={className}
        poster={poster}
      />
    );
  }

  // مشغل مباشر مع إدارة الجودة
  const videoSources = qualities && qualities.length > 0 
    ? qualities.map(q => ({
        url: q.url,
        quality: q.quality,
        resolution: q.resolution,
        type: 'mp4' as const
      }))
    : [
        {
          url: src,
          quality: getRecommendedVideoQuality(),
          resolution: getRecommendedVideoQuality(),
          type: 'mp4' as const
        }
      ];

  return (
    <VideoQualityManager
      sources={videoSources}
      title={title}
      onProgress={onProgress}
      onComplete={onComplete}
      className={className}
      poster={poster}
      autoplay={autoplay}
    />
  );
};