import { useState, useEffect } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface YouTubePlayerProps {
  videoUrl: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  className?: string;
}

export const YouTubePlayer = ({ 
  videoUrl, 
  title, 
  onProgress, 
  onComplete, 
  className 
}: YouTubePlayerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(videoUrl);

  useEffect(() => {
    if (videoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    }
  }, [videoId]);

  const loadVideo = () => {
    setIsLoaded(true);
    // Simulate progress tracking for demo
    const interval = setInterval(() => {
      onProgress?.(Math.random() * 100);
    }, 5000);

    // Simulate completion after 30 seconds for demo
    setTimeout(() => {
      clearInterval(interval);
      onComplete?.();
    }, 30000);
  };

  if (!videoId) {
    return (
      <div className={cn(
        "bg-muted rounded-lg p-8 text-center",
        className
      )}>
        <p className="text-muted-foreground">رابط الفيديو غير صالح</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div 
        className={cn(
          "relative bg-background rounded-lg overflow-hidden cursor-pointer group",
          className
        )}
        onClick={loadVideo}
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }}
        />
        
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white"
          >
            <Play size={24} fill="white" />
          </Button>
        </div>

        <div className="absolute bottom-4 right-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              window.open(videoUrl, '_blank');
            }}
            className="flex items-center gap-2"
          >
            <ExternalLink size={16} />
            فتح في YouTube
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};