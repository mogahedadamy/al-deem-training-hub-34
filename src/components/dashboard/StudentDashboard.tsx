import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DetailedProgressBar } from '@/components/progress/DetailedProgressBar';
import { useLearningProgress } from '@/contexts/LearningProgressContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Clock, Award, TrendingUp, PlayCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export const StudentDashboard = () => {
  const { state: learningState, getCourseProgress, loadUserProgress } = useLearningProgress();
  const { state: authState } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    avgProgress: 0
  });

  useEffect(() => {
    if (authState.isAuthenticated) {
      loadDashboardData();
      loadUserProgress();
    }
  }, [authState.isAuthenticated]);

  const loadDashboardData = async () => {
    if (!authState.user?.id) return;

    try {
      setIsLoading(true);

      // Load enrolled courses with progress
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            thumbnail_url
          )
        `)
        .eq('user_id', authState.user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      const coursesWithProgress: EnrolledCourse[] = [];
      let totalLessons = 0;
      let totalCompletedLessons = 0;
      let totalProgress = 0;

      for (const enrollment of enrollments || []) {
        const course = enrollment.courses;
        
        // Get lessons count for this course
        const { data: lessons, error: lessonsError } = await supabase
          .from('lessons')
          .select('id')
          .eq('course_id', course.id);

        if (lessonsError) continue;

        const lessonCount = lessons?.length || 0;
        
        // Get completed lessons count
        const { data: completedLessonsData, error: completedError } = await supabase
          .from('lesson_progress')
          .select('id')
          .eq('user_id', authState.user.id)
          .eq('completed', true)
          .in('lesson_id', lessons?.map(l => l.id) || []);

        if (completedError) continue;

        const completedCount = completedLessonsData?.length || 0;
        const progressPercent = lessonCount > 0 ? (completedCount / lessonCount) * 100 : 0;

        coursesWithProgress.push({
          id: course.id,
          title: course.title,
          thumbnail_url: course.thumbnail_url,
          enrolled_at: enrollment.enrolled_at,
          progress_percentage: Math.round(progressPercent),
          totalLessons: lessonCount,
          completedLessons: completedCount,
          lastAccessed: enrollment.enrolled_at
        });

        totalLessons += lessonCount;
        totalCompletedLessons += completedCount;
        totalProgress += progressPercent;
      }

      setEnrolledCourses(coursesWithProgress);

      // Calculate stats
      const completedCourses = coursesWithProgress.filter(c => c.progress_percentage === 100).length;
      const avgProgress = coursesWithProgress.length > 0 ? totalProgress / coursesWithProgress.length : 0;

      setStats({
        totalCourses: coursesWithProgress.length,
        completedCourses,
        totalLessons,
        completedLessons: totalCompletedLessons,
        avgProgress
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressIcon = (progress: number) => {
    if (progress === 100) return <Award className="w-5 h-5 text-yellow-500" />;
    if (progress > 0) return <PlayCircle className="w-5 h-5 text-blue-500" />;
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'منذ أقل من ساعة';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    return date.toLocaleDateString('ar-EG');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-cairo">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground font-cairo mb-2">
            مرحباً {authState.user?.profile?.full_name}
          </h1>
          <p className="text-muted-foreground font-cairo">تابع رحلتك التعليمية وحقق أهدافك</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-cairo">الدورات المسجلة</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground font-cairo">دورة مسجلة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-cairo">الدورات المكتملة</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedCourses}</div>
              <p className="text-xs text-muted-foreground font-cairo">دورة مكتملة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-cairo">الدروس المكتملة</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.completedLessons}</div>
              <p className="text-xs text-muted-foreground font-cairo">من {stats.totalLessons} درس</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-cairo">متوسط التقدم</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{Math.round(stats.avgProgress)}%</div>
              <Progress value={stats.avgProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground font-cairo">دوراتي</h2>
            <Button asChild variant="outline" className="font-cairo">
              <Link to="/">تصفح المزيد من الدورات</Link>
            </Button>
          </div>

          {enrolledCourses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground font-cairo mb-2">
                  لم تسجل في أي دورة بعد
                </h3>
                <p className="text-muted-foreground font-cairo mb-4">
                  ابدأ رحلتك التعليمية الآن واختر من مجموعة واسعة من الدورات
                </p>
                <Button asChild className="font-cairo">
                  <Link to="/">استكشف الدورات</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-white" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {getProgressIcon(course.progress_percentage)}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg font-cairo mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <div className="space-y-3">
                      <DetailedProgressBar
                        progress={course.progress_percentage}
                        totalLessons={course.totalLessons}
                        completedLessons={course.completedLessons}
                        showDetails={false}
                      />
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="font-cairo">
                          {course.completedLessons}/{course.totalLessons} دروس
                        </span>
                        <span className="font-cairo">
                          {course.lastAccessed && getTimeAgo(course.lastAccessed)}
                        </span>
                      </div>
                      
                      <Button asChild className="w-full font-cairo">
                        <Link to={`/course/${course.id}`}>
                          {course.progress_percentage === 0 ? 'ابدأ التعلم' : 
                           course.progress_percentage === 100 ? 'مراجعة الدورة' : 'متابعة التعلم'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};