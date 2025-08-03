// خدمة CDN محسنة لإدارة الملفات الثابتة
interface CDNConfig {
  baseUrl: string;
  enableWebP: boolean;
  enableCompression: boolean;
  cacheTTL: number;
}

class CDNService {
  private config: CDNConfig;
  private cache = new Map<string, string>();

  constructor() {
    this.config = {
      baseUrl: 'https://cdn.jsdelivr.net/gh',
      enableWebP: this.supportsWebP(),
      enableCompression: true,
      cacheTTL: 24 * 60 * 60 * 1000 // 24 ساعة
    };
  }

  // تحقق من دعم WebP
  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  }

  // تحسين رابط الصورة
  optimizeImageUrl(url: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}): string {
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    
    // التحقق من الcache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let optimizedUrl = url;

    // إذا كانت الصورة من Supabase، نضيف معاملات التحسين
    if (url.includes('supabase')) {
      const urlObj = new URL(url);
      
      if (options.width) urlObj.searchParams.set('width', options.width.toString());
      if (options.height) urlObj.searchParams.set('height', options.height.toString());
      if (options.quality) urlObj.searchParams.set('quality', options.quality.toString());
      
      // استخدام WebP إذا كان مدعوم
      if (this.config.enableWebP && !options.format) {
        urlObj.searchParams.set('format', 'webp');
      } else if (options.format) {
        urlObj.searchParams.set('format', options.format);
      }

      optimizedUrl = urlObj.toString();
    }
    // إذا كانت الصورة محلية، نستخدم CDN
    else if (url.startsWith('/')) {
      optimizedUrl = this.getCDNUrl(url, options);
    }

    // حفظ في الcache
    this.cache.set(cacheKey, optimizedUrl);
    
    // تنظيف الcache دورياً
    setTimeout(() => this.cache.delete(cacheKey), this.config.cacheTTL);

    return optimizedUrl;
  }

  // الحصول على رابط CDN
  private getCDNUrl(path: string, options: any): string {
    const params = new URLSearchParams();
    
    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.quality) params.set('q', options.quality.toString());
    
    const queryString = params.toString();
    return `${this.config.baseUrl}${path}${queryString ? `?${queryString}` : ''}`;
  }

  // تحميل مسبق للموارد المهمة
  preloadCriticalResources(urls: string[]) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = this.getResourceType(url);
      link.href = url;
      document.head.appendChild(link);
    });
  }

  // تحديد نوع المورد
  private getResourceType(url: string): string {
    if (url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) return 'image';
    if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video';
    if (url.match(/\.(css)$/i)) return 'style';
    if (url.match(/\.(js)$/i)) return 'script';
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
    return 'fetch';
  }

  // تحسين فيديو للجوال
  optimizeVideoForMobile(url: string, quality: 'low' | 'medium' | 'high' = 'medium'): string {
    if (!url.includes('bunnycdn.com') && !url.includes('b-cdn.net')) {
      return url;
    }

    const qualityMap = {
      low: '360p',
      medium: '720p',
      high: '1080p'
    };

    // إضافة معاملات تحسين الفيديو
    const urlObj = new URL(url);
    urlObj.searchParams.set('resolution', qualityMap[quality]);
    urlObj.searchParams.set('optimize', 'mobile');
    
    return urlObj.toString();
  }

  // تنظيف الcache
  clearCache() {
    this.cache.clear();
  }

  // إحصائيات الcache
  getCacheStats() {
    return {
      size: this.cache.size,
      urls: Array.from(this.cache.keys())
    };
  }
}

export const cdnService = new CDNService();