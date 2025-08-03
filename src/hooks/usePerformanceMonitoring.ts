import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  networkLatency: number;
  cacheHitRate: number;
  errorRate: number;
}

interface PerformanceThresholds {
  minFPS: number;
  maxMemoryUsage: number;
  maxLoadTime: number;
  maxNetworkLatency: number;
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  minFPS: 30,
  maxMemoryUsage: 100 * 1024 * 1024, // 100MB
  maxLoadTime: 3000, // 3 seconds
  maxNetworkLatency: 1000 // 1 second
};

export const usePerformanceMonitoring = (thresholds: Partial<PerformanceThresholds> = {}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    networkLatency: 0,
    cacheHitRate: 0,
    errorRate: 0
  });

  const [alerts, setAlerts] = useState<string[]>([]);
  const finalThresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const requestRef = useRef<number>();
  const errorCountRef = useRef(0);
  const requestCountRef = useRef(0);
  const cacheHitsRef = useRef(0);

  // قياس FPS
  const measureFPS = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;
    
    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
      setMetrics(prev => ({ ...prev, fps }));
      
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
    
    requestRef.current = requestAnimationFrame(measureFPS);
  }, []);

  // قياس استخدام الذاكرة
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize;
      setMetrics(prev => ({ ...prev, memoryUsage }));
      
      // تحذير إذا تجاوز الحد المسموح
      if (memoryUsage > finalThresholds.maxMemoryUsage) {
        setAlerts(prev => [...prev, 'استخدام الذاكرة مرتفع - يُنصح بإعادة تحميل الصفحة']);
      }
    }
  }, [finalThresholds.maxMemoryUsage]);

  // قياس وقت التحميل
  const measureLoadTime = useCallback(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      setMetrics(prev => ({ ...prev, loadTime }));
      
      if (loadTime > finalThresholds.maxLoadTime) {
        setAlerts(prev => [...prev, 'وقت التحميل بطيء - تحقق من اتصال الإنترنت']);
      }
    }
  }, [finalThresholds.maxLoadTime]);

  // قياس زمن الاستجابة للشبكة
  const measureNetworkLatency = useCallback(async () => {
    const start = performance.now();
    try {
      await fetch('/favicon.ico', { method: 'HEAD' });
      const latency = performance.now() - start;
      setMetrics(prev => ({ ...prev, networkLatency: latency }));
      
      if (latency > finalThresholds.maxNetworkLatency) {
        setAlerts(prev => [...prev, 'اتصال الإنترنت بطيء']);
      }
    } catch (error) {
      console.warn('Failed to measure network latency:', error);
    }
  }, [finalThresholds.maxNetworkLatency]);

  // تسجيل خطأ
  const reportError = useCallback(() => {
    errorCountRef.current++;
    requestCountRef.current++;
    
    const errorRate = (errorCountRef.current / requestCountRef.current) * 100;
    setMetrics(prev => ({ ...prev, errorRate }));
  }, []);

  // تسجيل نجاح الطلب
  const reportSuccess = useCallback((fromCache = false) => {
    requestCountRef.current++;
    if (fromCache) {
      cacheHitsRef.current++;
    }
    
    const cacheHitRate = (cacheHitsRef.current / requestCountRef.current) * 100;
    setMetrics(prev => ({ ...prev, cacheHitRate }));
  }, []);

  // حساب نقاط الأداء الإجمالية
  const getPerformanceScore = useCallback(() => {
    let score = 100;
    
    // خصم نقاط حسب المشاكل
    if (metrics.fps < finalThresholds.minFPS) {
      score -= (finalThresholds.minFPS - metrics.fps) * 2;
    }
    
    if (metrics.memoryUsage > finalThresholds.maxMemoryUsage) {
      score -= 20;
    }
    
    if (metrics.loadTime > finalThresholds.maxLoadTime) {
      score -= 15;
    }
    
    if (metrics.networkLatency > finalThresholds.maxNetworkLatency) {
      score -= 10;
    }
    
    score -= metrics.errorRate;
    
    return Math.max(0, Math.min(100, score));
  }, [metrics, finalThresholds]);

  // تشغيل المراقبة
  useEffect(() => {
    // بدء قياس FPS
    requestRef.current = requestAnimationFrame(measureFPS);
    
    // قياس دوري للمترات الأخرى
    const interval = setInterval(() => {
      measureMemory();
      measureLoadTime();
      measureNetworkLatency();
    }, 5000); // كل 5 ثوان

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      clearInterval(interval);
    };
  }, [measureFPS, measureMemory, measureLoadTime, measureNetworkLatency]);

  // إزالة التحذيرات القديمة
  useEffect(() => {
    const cleanup = setTimeout(() => {
      setAlerts([]);
    }, 10000); // كل 10 ثوان

    return () => clearTimeout(cleanup);
  }, [alerts]);

  return {
    metrics,
    alerts,
    getPerformanceScore,
    reportError,
    reportSuccess,
    clearAlerts: () => setAlerts([])
  };
};