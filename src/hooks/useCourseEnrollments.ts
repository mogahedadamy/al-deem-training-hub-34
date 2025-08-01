import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CourseEnrollmentCount {
  course_id: string;
  enrollment_count: number;
}

export const useCourseEnrollments = () => {
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollmentCounts = async () => {
    try {
      setLoading(true);
      
      // جلب عدد المسجلين لكل كورس من جدول course_enrollments
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .then(result => {
          if (result.error) throw result.error;
          
          // عد المسجلين لكل كورس
          const counts: Record<string, number> = {};
          result.data?.forEach(enrollment => {
            const courseId = enrollment.course_id;
            counts[courseId] = (counts[courseId] || 0) + 1;
          });
          
          return { data: counts, error: null };
        });

      if (error) {
        throw error;
      }

      setEnrollmentCounts(data || {});
      setError(null);
    } catch (err) {
      console.error('Error fetching enrollment counts:', err);
      setError('فشل في جلب أعداد المسجلين');
      setEnrollmentCounts({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollmentCounts();
  }, []);

  const getEnrollmentCount = (courseId: string): number => {
    return enrollmentCounts[courseId] || 0;
  };

  const refreshEnrollmentCounts = async () => {
    await fetchEnrollmentCounts();
  };

  return {
    enrollmentCounts,
    getEnrollmentCount,
    loading,
    error,
    refreshEnrollmentCounts
  };
};