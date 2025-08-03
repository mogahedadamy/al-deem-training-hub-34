// خدمة cache محسنة كبديل Redis محلي
interface CacheEntry {
  data: any;
  timestamp: number;
  accessCount: number;
  ttl: number;
  size: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  memoryUsage: number;
}

class EnhancedCacheService {
  private cache = new Map<string, CacheEntry>();
  private stats: CacheStats = { hits: 0, misses: 0, size: 0, memoryUsage: 0 };
  private maxSize: number;
  private maxMemory: number;
  private cleanupInterval: NodeJS.Timeout;

  constructor(options: {
    maxSize?: number;
    maxMemory?: number; // في bytes
    cleanupInterval?: number;
  } = {}) {
    this.maxSize = options.maxSize || 1000;
    this.maxMemory = options.maxMemory || 50 * 1024 * 1024; // 50MB
    
    // تنظيف دوري
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, options.cleanupInterval || 5 * 60 * 1000); // كل 5 دقائق
  }

  // حفظ في الcache
  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      accessCount: 0,
      ttl,
      size: this.calculateSize(data)
    };

    // التحقق من المساحة المتاحة
    if (this.wouldExceedLimits(entry)) {
      this.evictLeastUsed();
    }

    this.cache.set(key, entry);
    this.updateStats();
  }

  // الحصول على البيانات
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // التحقق من انتهاء الصلاحية
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // تحديث إحصائيات الاستخدام
    entry.accessCount++;
    entry.timestamp = Date.now(); // تحديث وقت آخر وصول
    this.stats.hits++;
    
    return entry.data;
  }

  // التحقق من وجود البيانات
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // التحقق من انتهاء الصلاحية
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // حذف من الcache
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.updateStats();
    return deleted;
  }

  // مسح الcache حسب النمط
  deletePattern(pattern: string): number {
    const regex = new RegExp(pattern);
    let deleted = 0;
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    
    this.updateStats();
    return deleted;
  }

  // مسح الcache بالكامل
  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, size: 0, memoryUsage: 0 };
  }

  // حساب حجم البيانات (تقديري)
  private calculateSize(data: any): number {
    return JSON.stringify(data).length * 2; // تقدير تقريبي
  }

  // التحقق من تجاوز الحدود
  private wouldExceedLimits(entry: CacheEntry): boolean {
    return this.cache.size >= this.maxSize || 
           this.stats.memoryUsage + entry.size > this.maxMemory;
  }

  // إزالة العناصر الأقل استخداماً
  private evictLeastUsed(): void {
    if (this.cache.size === 0) return;

    const entries = Array.from(this.cache.entries());
    
    // ترتيب حسب عدد مرات الوصول والوقت
    entries.sort(([, a], [, b]) => {
      if (a.accessCount !== b.accessCount) {
        return a.accessCount - b.accessCount;
      }
      return a.timestamp - b.timestamp;
    });

    // إزالة 25% من العناصر الأقل استخداماً
    const toRemove = Math.ceil(entries.length * 0.25);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  // تنظيف العناصر المنتهية الصلاحية
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    this.updateStats();
  }

  // تحديث الإحصائيات
  private updateStats(): void {
    this.stats.size = this.cache.size;
    this.stats.memoryUsage = Array.from(this.cache.values())
      .reduce((total, entry) => total + entry.size, 0);
  }

  // الحصول على الإحصائيات
  getStats(): CacheStats & {
    hitRate: number;
    entries: Array<{key: string; size: number; accessCount: number; age: number}>;
  } {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      size: entry.size,
      accessCount: entry.accessCount,
      age: Date.now() - entry.timestamp
    }));

    return {
      ...this.stats,
      hitRate,
      entries
    };
  }

  // تدمير الخدمة
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// إنشاء instance عالمي
export const cacheService = new EnhancedCacheService({
  maxSize: 2000,
  maxMemory: 100 * 1024 * 1024, // 100MB
  cleanupInterval: 3 * 60 * 1000 // كل 3 دقائق
});

// Hook لاستخدام الcache
export const useCache = () => {
  const set = (key: string, data: any, ttl?: number) => {
    cacheService.set(key, data, ttl);
  };

  const get = (key: string) => {
    return cacheService.get(key);
  };

  const invalidate = (pattern: string) => {
    return cacheService.deletePattern(pattern);
  };

  const getStats = () => {
    return cacheService.getStats();
  };

  return { set, get, invalidate, getStats };
};