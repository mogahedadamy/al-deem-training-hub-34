import { useEffect, useCallback } from 'react';
import { cdnService } from '@/services/cdnService';
import { useMobileDetection } from './useMobileDetection';

interface UseResourceOptimizationOptions {
  preloadCritical?: string[];
  enableLazyLoading?: boolean;
  optimizeImages?: boolean;
}

export const useResourceOptimization = (options: UseResourceOptimizationOptions = {}) => {
  const { isMobile, isTablet } = useMobileDetection();
  const {
    preloadCritical = [],
    enableLazyLoading = true,
    optimizeImages = true
  } = options;

  // تحسين الصورة حسب نوع الجهاز
  const optimizeImage = useCallback((url: string, maxWidth?: number) => {
    if (!optimizeImages) return url;

    let width = maxWidth;
    let quality = 85;

    // تحسين حسب نوع الجهاز
    if (isMobile) {
      width = Math.min(width || 400, 400);
      quality = 75;
    } else if (isTablet) {
      width = Math.min(width || 800, 800);
      quality = 80;
    }

    return cdnService.optimizeImageUrl(url, {
      width,
      quality,
      format: 'webp'
    });
  }, [isMobile, isTablet, optimizeImages]);

  // تحسين الفيديو حسب نوع الجهاز
  const optimizeVideo = useCallback((url: string) => {
    let quality: 'low' | 'medium' | 'high' = 'high';

    if (isMobile) {
      quality = 'medium';
    } else if (isTablet) {
      quality = 'high';
    }

    return cdnService.optimizeVideoForMobile(url, quality);
  }, [isMobile, isTablet]);

  // تحميل مسبق للموارد المهمة
  useEffect(() => {
    if (preloadCritical.length > 0) {
      const optimizedUrls = preloadCritical.map(url => 
        url.match(/\.(jpg|jpeg|png|webp|gif)$/i) 
          ? optimizeImage(url) 
          : url
      );
      
      cdnService.preloadCriticalResources(optimizedUrls);
    }
  }, [preloadCritical, optimizeImage]);

  // تفعيل Intersection Observer للـ Lazy Loading
  useEffect(() => {
    if (!enableLazyLoading) return;

    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = optimizeImage(src);
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    images.forEach(img => imageObserver.observe(img));

    return () => {
      images.forEach(img => imageObserver.unobserve(img));
    };
  }, [enableLazyLoading, optimizeImage]);

  // تنظيف دوري للذاكرة
  useEffect(() => {
    const cleanup = setInterval(() => {
      // تنظيف cache الصور إذا تجاوز حد معين
      const stats = cdnService.getCacheStats();
      if (stats.size > 100) {
        cdnService.clearCache();
      }
    }, 5 * 60 * 1000); // كل 5 دقائق

    return () => clearInterval(cleanup);
  }, []);

  return {
    optimizeImage,
    optimizeVideo,
    isMobile,
    isTablet
  };
};