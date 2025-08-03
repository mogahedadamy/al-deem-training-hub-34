import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DetailedProgressBar } from '@/components/progress/DetailedProgressBar';
import { useDashboardOptimized } from '@/hooks/useDashboardOptimized';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DashboardLoading } from '@/components/LoadingStates';
import { BookOpen, Clock, Award, TrendingUp, PlayCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

// مكون محسن للوحة التحكم
const DashboardContent = () => {
  const { state: authState } = useAuth();
  const { enrolledCourses, stats, isLoading, error, refreshData } = useDashboardOptimized(authState.user?.id);

  // معالجة حالات الخطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-cairo">{error}</AlertDescription>
          </Alert>
          <Button onClick={refreshData} variant="outline" className="font-cairo">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

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

  // حالة التحميل
  if (isLoading) {
    return <DashboardLoading />;
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

// المكون الرئيسي مع Error Boundary
export const StudentDashboard = () => {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
};