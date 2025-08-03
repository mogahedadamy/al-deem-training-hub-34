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

interface Course {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  thumbnail_url?: string;
  price: number;
  level: string;
  category?: string;
  duration_hours?: number;
  status: string;
  features?: string[];
  created_at: string;
}

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration_minutes?: number;
  order_index: number;
  lesson_type: string;
  is_free: boolean;
  video_url?: string;
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

// Hook مخصص للكورسات مع تحسينات
export function usePaginatedCourses(filters: {
  category?: string;
  level?: string;
  status?: string;
} = {}): PaginatedResult<Course> {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // إنشاء cache key
  const getCacheKey = useCallback((page: number) => {
    const filterKey = Object.keys(filters).length > 0 ? JSON.stringify(filters) : 'all';
    return `courses_${filterKey}_${page}`;
  }, [filters]);

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
      ttl: CACHE_TTL.courses
    });
  }, []);

  // تحميل البيانات
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

      // بناء الاستعلام
      let query = supabase
        .from('courses')
        .select(`
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
        `, { count: 'exact' });

      // إضافة الفلاتر
      query = query.eq('status', 'published');
      
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      
      if (filters.level && filters.level !== 'all') {
        query = query.eq('level', filters.level);
      }

      // الترتيب والpagination
      query = query
        .order('created_at', { ascending: false })
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
      console.error('Error loading courses:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, [filters, pageSize, getCacheKey, getFromCache, saveToCache]);

  // تحميل المزيد
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await loadData(nextPage, true);
  }, [hasMore, loading, currentPage, loadData]);

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

// Hook للدروس مع pagination
export function usePaginatedLessons(courseId: string): PaginatedResult<Lesson> {
  const [data, setData] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const loadData = useCallback(async (page: number, append = false) => {
    try {
      if (!append) setLoading(true);
      setError(null);

      const { data: result, error: queryError, count } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          description,
          duration_minutes,
          order_index,
          lesson_type,
          is_free,
          video_url
        `, { count: 'exact' })
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (queryError) throw queryError;

      if (append) {
        setData(prev => [...prev, ...result || []]);
      } else {
        setData(result || []);
      }
      
      setTotalCount(count || 0);
      setHasMore((result || []).length === pageSize);

    } catch (err) {
      console.error('Error loading lessons:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الدروس');
    } finally {
      setLoading(false);
    }
  }, [courseId, pageSize]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await loadData(nextPage, true);
  }, [hasMore, loading, currentPage, loadData]);

  const refresh = useCallback(async () => {
    setCurrentPage(1);
    setData([]);
    await loadData(1, false);
  }, [loadData]);

  const loadPage = useCallback(async (page: number) => {
    setCurrentPage(page);
    await loadData(page, false);
  }, [loadData]);

  useEffect(() => {
    if (courseId) {
      loadData(1, false);
    }
  }, [courseId, loadData]);

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