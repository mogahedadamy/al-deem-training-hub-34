import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
  cacheTime?: number;
  staleTime?: number;
}

interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Cache مع انتهاء صلاحية
const queryCache = new Map<string, {
  data: any;
  timestamp: number;
  staleTime: number;
}>();

export function useOptimizedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  options: QueryOptions = {}
): QueryResult<T> {
  const {
    enabled = true,
    refetchInterval,
    cacheTime = 5 * 60 * 1000, // 5 دقائق
    staleTime = 0
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const executeQuery = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // التحقق من الcache أولاً
      const cached = queryCache.get(key);
      if (cached && Date.now() - cached.timestamp < cached.staleTime) {
        setData(cached.data);
        setIsLoading(false);
        return;
      }

      // تنفيذ الاستعلام
      const result = await queryFn();
      
      // حفظ في الcache
      queryCache.set(key, {
        data: result,
        timestamp: Date.now(),
        staleTime: staleTime || cacheTime
      });

      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      console.error(`Query error for ${key}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [key, queryFn, cacheTime, staleTime]);

  const refetch = useCallback(async () => {
    // إزالة من الcache وإعادة التحميل
    queryCache.delete(key);
    await executeQuery();
  }, [key, executeQuery]);

  // تنفيذ الاستعلام عند التفعيل
  useEffect(() => {
    if (enabled) {
      executeQuery();
    }
  }, [enabled, executeQuery]);

  // إعداد التحديث التلقائي
  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(executeQuery, refetchInterval);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [refetchInterval, enabled, executeQuery]);

  // تنظيف عند إلغاء التثبيت
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { data, isLoading, error, refetch };
}

// Hook مخصص للكورسات مع تحسينات
export function useOptimizedCourses(limit?: number) {
  return useOptimizedQuery(
    `courses_${limit || 'all'}`,
    async () => {
      let query = supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          thumbnail_url,
          price,
          level,
          duration
        `);
      
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 دقائق
      cacheTime: 30 * 60 * 1000  // 30 دقيقة
    }
  );
}

// Hook للاستعلامات مع pagination
export function usePaginatedQuery<T>(
  key: string,
  queryFn: (page: number, pageSize: number) => Promise<{ data: T[]; count: number }>,
  pageSize = 10
) {
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const { data, isLoading, error, refetch } = useOptimizedQuery(
    `${key}_page_${page}`,
    () => queryFn(page, pageSize),
    {
      enabled: hasMore || page === 1
    }
  );

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setAllData(data.data);
      } else {
        setAllData(prev => [...prev, ...data.data]);
      }
      setTotalCount(data.count);
      setHasMore(data.data.length === pageSize);
    }
  }, [data, page, pageSize]);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isLoading]);

  const reset = useCallback(() => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
    queryCache.delete(`${key}_page_1`);
    refetch();
  }, [key, refetch]);

  return {
    data: allData,
    isLoading,
    error,
    hasMore,
    totalCount,
    loadMore,
    reset,
    currentPage: page
  };
}