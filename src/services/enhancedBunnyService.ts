import { cdnService } from './cdnService';

interface BunnyConfig {
  pullZone: string;
  storageZone: string;
  accessKey: string;
  baseUrl: string;
}

interface VideoQuality {
  resolution: string;
  bitrate: number;
  url: string;
  size?: number;
}

interface VideoAnalytics {
  views: number;
  watchTime: number;
  averageWatchTime: number;
  completionRate: number;
}

class EnhancedBunnyService {
  private config: BunnyConfig;
  private videoCache = new Map<string, VideoQuality[]>();
  private analyticsCache = new Map<string, VideoAnalytics>();

  constructor() {
    this.config = {
      pullZone: 'al-deem-training',
      storageZone: 'al-deem-storage',
      accessKey: process.env.BUNNY_ACCESS_KEY || '',
      baseUrl: 'https://al-deem-training.b-cdn.net'
    };
  }

  // الحصول على جودات الفيديو المتاحة
  async getVideoQualities(videoId: string): Promise<VideoQuality[]> {
    // التحقق من الcache أولاً
    if (this.videoCache.has(videoId)) {
      return this.videoCache.get(videoId)!;
    }

    try {
      const qualities: VideoQuality[] = [
        {
          resolution: '360p',
          bitrate: 800,
          url: `${this.config.baseUrl}/videos/${videoId}/360p.mp4`
        },
        {
          resolution: '720p',
          bitrate: 2500,
          url: `${this.config.baseUrl}/videos/${videoId}/720p.mp4`
        },
        {
          resolution: '1080p',
          bitrate: 5000,
          url: `${this.config.baseUrl}/videos/${videoId}/1080p.mp4`
        }
      ];

      // حفظ في الcache
      this.videoCache.set(videoId, qualities);
      
      return qualities;
    } catch (error) {
      console.error('Error fetching video qualities:', error);
      return [];
    }
  }

  // اختيار الجودة المناسبة حسب سرعة الاتصال
  selectOptimalQuality(
    qualities: VideoQuality[], 
    networkSpeed: number, // Mbps
    deviceType: 'mobile' | 'tablet' | 'desktop'
  ): VideoQuality {
    // فلترة الجودات حسب نوع الجهاز
    let availableQualities = qualities;
    
    if (deviceType === 'mobile') {
      availableQualities = qualities.filter(q => 
        ['360p', '720p'].includes(q.resolution)
      );
    }

    // اختيار الجودة حسب سرعة الشبكة
    if (networkSpeed < 1) {
      return availableQualities.find(q => q.resolution === '360p') || qualities[0];
    } else if (networkSpeed < 3) {
      return availableQualities.find(q => q.resolution === '720p') || qualities[0];
    } else {
      return availableQualities[availableQualities.length - 1];
    }
  }

  // تحسين URL الفيديو للتشغيل
  optimizeVideoUrl(url: string, options: {
    quality?: string;
    autoplay?: boolean;
    preload?: 'none' | 'metadata' | 'auto';
    enableHLS?: boolean;
  } = {}): string {
    const urlObj = new URL(url);
    
    // إضافة معاملات التحسين
    if (options.quality) {
      urlObj.searchParams.set('quality', options.quality);
    }
    
    if (options.autoplay === false) {
      urlObj.searchParams.set('autoplay', '0');
    }
    
    if (options.preload) {
      urlObj.searchParams.set('preload', options.preload);
    }

    // تفعيل HLS للتشغيل المتدفق
    if (options.enableHLS) {
      urlObj.searchParams.set('protocol', 'hls');
    }

    // إضافة معاملات الcache
    urlObj.searchParams.set('cache', '3600'); // ساعة واحدة
    
    return urlObj.toString();
  }

  // رفع فيديو جديد
  async uploadVideo(file: File, metadata: {
    title: string;
    description?: string;
    courseId: string;
    lessonId: string;
  }): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('metadata', JSON.stringify(metadata));

      // محاكاة رفع الفيديو
      const response = await fetch(`${this.config.baseUrl}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result.videoId;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

  // حذف فيديو
  async deleteVideo(videoId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.accessKey}`
        }
      });

      if (response.ok) {
        // إزالة من الcache
        this.videoCache.delete(videoId);
        this.analyticsCache.delete(videoId);
      }

      return response.ok;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }

  // تسجيل مشاهدة الفيديو
  async recordView(videoId: string, watchTime: number, userId?: string): Promise<void> {
    try {
      await fetch(`${this.config.baseUrl}/analytics/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessKey}`
        },
        body: JSON.stringify({
          videoId,
          watchTime,
          userId,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  }

  // الحصول على إحصائيات الفيديو
  async getVideoAnalytics(videoId: string): Promise<VideoAnalytics | null> {
    // التحقق من الcache
    if (this.analyticsCache.has(videoId)) {
      return this.analyticsCache.get(videoId)!;
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/analytics/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.accessKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Analytics fetch failed');
      }

      const analytics = await response.json();
      
      // حفظ في الcache لمدة 5 دقائق
      this.analyticsCache.set(videoId, analytics);
      setTimeout(() => this.analyticsCache.delete(videoId), 5 * 60 * 1000);

      return analytics;
    } catch (error) {
      console.error('Error fetching video analytics:', error);
      return null;
    }
  }

  // تحسين التخزين المؤقت
  async prefetchVideo(videoId: string, quality: string = '720p'): Promise<void> {
    try {
      const url = `${this.config.baseUrl}/videos/${videoId}/${quality}.mp4`;
      
      // تحميل مسبق للفيديو
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'video';
      link.href = url;
      document.head.appendChild(link);
      
      // إزالة الlink بعد 30 ثانية
      setTimeout(() => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      }, 30000);
    } catch (error) {
      console.error('Error prefetching video:', error);
    }
  }

  // تنظيف الcache
  clearCache(): void {
    this.videoCache.clear();
    this.analyticsCache.clear();
  }

  // إحصائيات الcache
  getCacheStats() {
    return {
      videoCache: this.videoCache.size,
      analyticsCache: this.analyticsCache.size,
      totalCacheSize: this.videoCache.size + this.analyticsCache.size
    };
  }
}

export const enhancedBunnyService = new EnhancedBunnyService();