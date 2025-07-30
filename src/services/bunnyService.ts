// خدمة Bunny.net للتعامل مع الفيديوهات
interface BunnyConfig {
  storageZoneName: string;
  accessKey: string;
  cdnUrl: string;
  streamApiKey?: string;
}

interface VideoMetadata {
  id: string;
  title: string;
  description?: string;
  duration: number;
  size: number;
  url: string;
  thumbnail?: string;
  createdAt: string;
}

class BunnyVideoService {
  private config: BunnyConfig | null = null;

  // تكوين الخدمة
  configure(config: BunnyConfig) {
    this.config = config;
  }

  // التحقق من التكوين
  private ensureConfigured() {
    if (!this.config) {
      throw new Error('Bunny service not configured. Call configure() first.');
    }
    return this.config;
  }

  // رفع فيديو إلى Bunny Storage
  async uploadVideo(
    file: File, 
    fileName: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const config = this.ensureConfigured();
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
          const videoUrl = `${config.cdnUrl}/${fileName}`;
          resolve(videoUrl);
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      const url = `https://storage.bunnycdn.com/${config.storageZoneName}/${fileName}`;
      xhr.open('PUT', url);
      xhr.setRequestHeader('AccessKey', config.accessKey);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  // حذف فيديو من Bunny Storage
  async deleteVideo(fileName: string): Promise<boolean> {
    const config = this.ensureConfigured();
    
    try {
      const response = await fetch(
        `https://storage.bunnycdn.com/${config.storageZoneName}/${fileName}`,
        {
          method: 'DELETE',
          headers: {
            'AccessKey': config.accessKey,
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }

  // إنشاء رابط محمي للفيديو
  generateSecureUrl(fileName: string, expiresIn: number = 3600): string {
    const config = this.ensureConfigured();
    const expires = Math.floor(Date.now() / 1000) + expiresIn;
    
    // في التطبيق الحقيقي، ستحتاج لتوقيع الرابط
    // هذا مثال مبسط
    const baseUrl = `${config.cdnUrl}/${fileName}`;
    const secureUrl = `${baseUrl}?expires=${expires}&token=generated_token`;
    
    return secureUrl;
  }

  // الحصول على معلومات الفيديو
  async getVideoInfo(fileName: string): Promise<VideoMetadata | null> {
    const config = this.ensureConfigured();
    
    try {
      const response = await fetch(
        `https://storage.bunnycdn.com/${config.storageZoneName}/${fileName}`,
        {
          method: 'HEAD',
          headers: {
            'AccessKey': config.accessKey,
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      const size = parseInt(response.headers.get('content-length') || '0');
      const lastModified = response.headers.get('last-modified') || new Date().toISOString();

      return {
        id: fileName,
        title: fileName,
        size,
        url: `${config.cdnUrl}/${fileName}`,
        duration: 0, // سيتم تحديثه من metadata الفيديو
        createdAt: lastModified,
      };
    } catch (error) {
      console.error('Error getting video info:', error);
      return null;
    }
  }

  // تحويل فيديو إلى أشكال متعددة (إن كان متاحاً)
  async createVideoVariants(fileName: string): Promise<string[]> {
    // هذه ستكون متاحة مع Bunny Stream
    // حالياً نعيد الرابط الأصلي فقط
    const config = this.ensureConfigured();
    return [`${config.cdnUrl}/${fileName}`];
  }

  // إنشاء thumbnail للفيديو
  generateThumbnailUrl(fileName: string, timeSeconds: number = 10): string {
    const config = this.ensureConfigured();
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    return `${config.cdnUrl}/${nameWithoutExt}_thumb_${timeSeconds}.jpg`;
  }
}

// إنشاء instance واحد للخدمة
export const bunnyVideoService = new BunnyVideoService();

// دالة للحصول على تكوين Bunny من المتغيرات
export const getBunnyConfig = (): BunnyConfig => {
  // في بيئة الإنتاج، ستأتي هذه من Supabase Secrets
  return {
    storageZoneName: process.env.BUNNY_STORAGE_ZONE || 'your-storage-zone',
    accessKey: process.env.BUNNY_ACCESS_KEY || 'your-access-key',
    cdnUrl: process.env.BUNNY_CDN_URL || 'https://your-zone.b-cdn.net',
    streamApiKey: process.env.BUNNY_STREAM_API_KEY,
  };
};

// أنواع للاستخدام في التطبيق
export type { BunnyConfig, VideoMetadata };