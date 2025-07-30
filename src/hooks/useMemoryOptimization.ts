import { useEffect, useCallback, useRef } from 'react';

interface MemoryOptimizationOptions {
  maxCacheSize?: number; // MB
  enableAutoCleanup?: boolean;
  cleanupInterval?: number; // ms
}

export const useMemoryOptimization = ({
  maxCacheSize = 50,
  enableAutoCleanup = true,
  cleanupInterval = 30000 // 30 seconds
}: MemoryOptimizationOptions = {}) => {
  const cache = useRef(new Map());
  const cleanupTimer = useRef<NodeJS.Timeout>();

  // Get current memory usage
  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) // MB
      };
    }
    return null;
  }, []);

  // Check if memory usage is high
  const isMemoryHigh = useCallback(() => {
    const memory = getMemoryUsage();
    if (!memory) return false;
    
    return (memory.used / memory.limit) > 0.8; // 80% threshold
  }, [getMemoryUsage]);

  // Force garbage collection (if available)
  const forceGarbageCollection = useCallback(() => {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }, []);

  // Clean up cached data
  const cleanupCache = useCallback(() => {
    const memory = getMemoryUsage();
    if (!memory) return;

    // If memory usage is high, clear half the cache
    if (isMemoryHigh()) {
      const entries = Array.from(cache.current.entries());
      const toDelete = entries.slice(0, Math.floor(entries.length / 2));
      
      toDelete.forEach(([key]) => {
        cache.current.delete(key);
      });

      console.log(`Memory cleanup: Removed ${toDelete.length} cached items`);
      
      // Force GC if available
      setTimeout(forceGarbageCollection, 100);
    }
  }, [getMemoryUsage, isMemoryHigh, forceGarbageCollection]);

  // Cache data with automatic cleanup
  const cacheData = useCallback((key: string, data: any) => {
    cache.current.set(key, {
      data,
      timestamp: Date.now(),
      size: JSON.stringify(data).length
    });

    // Check if we need immediate cleanup
    if (isMemoryHigh()) {
      cleanupCache();
    }
  }, [isMemoryHigh, cleanupCache]);

  // Get cached data
  const getCachedData = useCallback((key: string) => {
    const cached = cache.current.get(key);
    if (!cached) return null;

    // Update access time
    cached.timestamp = Date.now();
    return cached.data;
  }, []);

  // Clear specific cache entry
  const clearCache = useCallback((key: string) => {
    cache.current.delete(key);
  }, []);

  // Clear all cache
  const clearAllCache = useCallback(() => {
    cache.current.clear();
    forceGarbageCollection();
  }, [forceGarbageCollection]);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    const entries = Array.from(cache.current.values());
    const totalSize = entries.reduce((sum, entry) => sum + (entry.size || 0), 0);
    
    return {
      entries: cache.current.size,
      totalSize: Math.round(totalSize / 1024 / 1024 * 100) / 100, // MB
      memory: getMemoryUsage()
    };
  }, [getMemoryUsage]);

  // Setup automatic cleanup
  useEffect(() => {
    if (!enableAutoCleanup) return;

    cleanupTimer.current = setInterval(() => {
      cleanupCache();
      
      // Remove old entries (older than 5 minutes)
      const now = Date.now();
      const maxAge = 5 * 60 * 1000; // 5 minutes
      
      Array.from(cache.current.entries()).forEach(([key, value]) => {
        if (now - value.timestamp > maxAge) {
          cache.current.delete(key);
        }
      });
    }, cleanupInterval);

    return () => {
      if (cleanupTimer.current) {
        clearInterval(cleanupTimer.current);
      }
    };
  }, [enableAutoCleanup, cleanupInterval, cleanupCache]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllCache();
    };
  }, [clearAllCache]);

  return {
    cacheData,
    getCachedData,
    clearCache,
    clearAllCache,
    getCacheStats,
    getMemoryUsage,
    isMemoryHigh,
    forceGarbageCollection,
    cleanupCache
  };
};