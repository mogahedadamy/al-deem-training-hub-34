import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PaginationOptions {
  pageSize?: number;
  enableInfiniteScroll?: boolean;
}

interface PaginatedResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  loadPage: (page: number) => Promise<void>;
}

// Cache عالمي محسن
const globalCache = new Map<string, {
  data: any;
  timestamp: number;
  ttl: number;
}>();

const CACHE_TTL = {
  courses: 10 * 60 * 1000, // 10 دقائق
  lessons: 5 * 60 * 1000,  // 5 دقائق
  profiles: 15 * 60 * 1000, // 15 دقيقة
  default: 5 * 60 * 1000
};

export function usePaginatedQuery<T>(
  table: string,
  options: PaginationOptions & {
    select?: string;
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    cacheTTL?: number;
  } = {}
): PaginatedResult<T> {
  const {
    pageSize = 12,
    enableInfiniteScroll = true,
    select = '*',
    filters = {},
    orderBy = { column: 'created_at', ascending: false },
    cacheTTL = CACHE_TTL[table as keyof typeof CACHE_TTL] || CACHE_TTL.default
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // إنشاء cache key
  const getCacheKey = useCallback((page: number) => {
    const filterKey = Object.keys(filters).length > 0 ? JSON.stringify(filters) : 'all';
    return `${table}_${filterKey}_${orderBy.column}_${orderBy.ascending}_${page}`;
  }, [table, filters, orderBy]);

  // التحقق من الcache
  const getFromCache = useCallback((key: string) => {
    const cached = globalCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    globalCache.delete(key);
    return null;
  }, []);

  // حفظ في الcache
  const saveToCache = useCallback((key: string, data: any) => {
    globalCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: cacheTTL
    });
  }, [cacheTTL]);

  // تحميل البيانات مع pagination محسنة
  const loadData = useCallback(async (page: number, append = false) => {
    try {
      if (!append) setLoading(true);
      setError(null);

      const cacheKey = getCacheKey(page);
      const cachedData = getFromCache(cacheKey);
      
      if (cachedData) {
        if (append) {
          setData(prev => [...prev, ...cachedData.data]);
        } else {
          setData(cachedData.data);
        }
        setTotalCount(cachedData.count);
        setHasMore(cachedData.data.length === pageSize);
        setLoading(false);
        return;
      }

      // بناء الاستعلام مع تحسينات
      let query = supabase
        .from(table)
        .select(select, { count: 'exact' });

      // إضافة الفلاتر
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // الترتيب والpagination
      query = query
        .order(orderBy.column, { ascending: orderBy.ascending })
        .range((page - 1) * pageSize, page * pageSize - 1);

      const { data: result, error: queryError, count } = await query;

      if (queryError) throw queryError;

      const resultData = {
        data: result || [],
        count: count || 0
      };

      // حفظ في الcache
      saveToCache(cacheKey, resultData);

      if (append) {
        setData(prev => [...prev, ...resultData.data]);
      } else {
        setData(resultData.data);
      }
      
      setTotalCount(resultData.count);
      setHasMore(resultData.data.length === pageSize);

    } catch (err) {
      console.error(`Error loading ${table}:`, err);
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, [table, select, filters, orderBy, pageSize, getCacheKey, getFromCache, saveToCache]);

  // تحميل المزيد
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await loadData(nextPage, enableInfiniteScroll);
  }, [hasMore, loading, currentPage, loadData, enableInfiniteScroll]);

  // تحديث البيانات
  const refresh = useCallback(async () => {
    // مسح الcache
    globalCache.clear();
    setCurrentPage(1);
    setData([]);
    await loadData(1, false);
  }, [loadData]);

  // تحميل صفحة محددة
  const loadPage = useCallback(async (page: number) => {
    setCurrentPage(page);
    await loadData(page, false);
  }, [loadData]);

  // التحميل الأولي
  useEffect(() => {
    loadData(1, false);
  }, [loadData]);

  return {
    data,
    loading,
    error,
    hasMore,
    totalCount,
    currentPage,
    loadMore,
    refresh,
    loadPage
  };
}

// Hook مخصص للكورسات مع تحسينات
export function usePaginatedCourses(filters: {
  category?: string;
  level?: string;
  status?: string;
} = {}) {
  return usePaginatedQuery('courses', {
    pageSize: 12,
    select: `
      id,
      title,
      description,
      short_description,
      thumbnail_url,
      price,
      level,
      category,
      duration_hours,
      status,
      features,
      created_at
    `,
    filters: {
      status: 'published',
      ...filters
    },
    orderBy: { column: 'created_at', ascending: false },
    cacheTTL: CACHE_TTL.courses
  });
}

// Hook للدروس مع pagination
export function usePaginatedLessons(courseId: string) {
  return usePaginatedQuery('lessons', {
    pageSize: 20,
    select: `
      id,
      title,
      description,
      duration_minutes,
      order_index,
      lesson_type,
      is_free,
      video_url
    `,
    filters: { course_id: courseId },
    orderBy: { column: 'order_index', ascending: true },
    cacheTTL: CACHE_TTL.lessons
  });
}