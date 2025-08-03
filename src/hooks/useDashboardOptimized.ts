import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EnrolledCourse {
  id: string;
  title: string;
  thumbnail_url?: string;
  enrolled_at: string;
  progress_percentage: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed?: string;
}

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  avgProgress: number;
}

// Cache للبيانات مع انتهاء صلاحية
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 دقائق

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key: string, data: any, ttl = CACHE_TTL) => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
};

export const useDashboardOptimized = (userId?: string) => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache key للمستخدم
  const cacheKey = `dashboard_${userId}`;

  // تحسين استعلام واحد محسن للحصول على جميع البيانات
  const loadDashboardData = useCallback(async () => {
    if (!userId) return;

    // التحقق من الcache أولاً
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      setEnrolledCourses(cachedData);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // استخدام الطريقة المحسنة مباشرة
      const processedData = await loadDashboardDataFallback(userId);
      setEnrolledCourses(processedData);
      setCachedData(cacheKey, processedData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('حدث خطأ في تحميل البيانات');
      
      // Fallback إلى البيانات المخزنة مؤقتاً
      const fallbackData = await loadDashboardDataFallback(userId);
      setEnrolledCourses(fallbackData);
    } finally {
      setIsLoading(false);
    }
  }, [userId, cacheKey]);

  // Fallback method مع تحسينات
  const loadDashboardDataFallback = async (userId: string): Promise<EnrolledCourse[]> => {
    // استعلام محسن مع join statements
    const { data: enrollments, error } = await supabase
      .from('course_enrollments')
      .select(`
        enrolled_at,
        courses!inner (
          id,
          title,
          thumbnail_url,
          lessons (
            id,
            lesson_progress!left (
              id,
              completed,
              user_id
            )
          )
        )
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;

    return (enrollments || []).map(enrollment => {
      const course = enrollment.courses;
      const lessons = course.lessons || [];
      const totalLessons = lessons.length;
      
      // حساب الدروس المكتملة بكفاءة
      const completedLessons = lessons.filter(lesson => 
        lesson.lesson_progress?.some(progress => 
          progress.user_id === userId && progress.completed
        )
      ).length;

      const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      return {
        id: course.id,
        title: course.title,
        thumbnail_url: course.thumbnail_url,
        enrolled_at: enrollment.enrolled_at,
        progress_percentage: Math.round(progressPercent),
        totalLessons,
        completedLessons,
        lastAccessed: enrollment.enrolled_at
      };
    });
  };

  // معالجة البيانات من database function
  const processDashboardData = (data: any[]): EnrolledCourse[] => {
    return data.map(item => ({
      id: item.course_id,
      title: item.course_title,
      thumbnail_url: item.thumbnail_url,
      enrolled_at: item.enrolled_at,
      progress_percentage: Math.round(item.progress_percentage || 0),
      totalLessons: item.total_lessons || 0,
      completedLessons: item.completed_lessons || 0,
      lastAccessed: item.last_accessed || item.enrolled_at
    }));
  };

  // حساب الإحصائيات باستخدام useMemo للتحسين
  const stats: DashboardStats = useMemo(() => {
    if (enrolledCourses.length === 0) {
      return {
        totalCourses: 0,
        completedCourses: 0,
        totalLessons: 0,
        completedLessons: 0,
        avgProgress: 0
      };
    }

    const completedCourses = enrolledCourses.filter(c => c.progress_percentage === 100).length;
    const totalLessons = enrolledCourses.reduce((sum, c) => sum + c.totalLessons, 0);
    const totalCompletedLessons = enrolledCourses.reduce((sum, c) => sum + c.completedLessons, 0);
    const totalProgress = enrolledCourses.reduce((sum, c) => sum + c.progress_percentage, 0);
    const avgProgress = totalProgress / enrolledCourses.length;

    return {
      totalCourses: enrolledCourses.length,
      completedCourses,
      totalLessons,
      completedLessons: totalCompletedLessons,
      avgProgress
    };
  }, [enrolledCourses]);

  // تحديث البيانات من Cache
  const refreshData = useCallback(() => {
    cache.delete(cacheKey);
    loadDashboardData();
  }, [cacheKey, loadDashboardData]);

  // تحميل البيانات عند تغيير userId
  useEffect(() => {
    if (userId) {
      loadDashboardData();
    }
  }, [userId, loadDashboardData]);

  return {
    enrolledCourses,
    stats,
    isLoading,
    error,
    refreshData
  };
};