import { BookOpen, Trophy, Clock, TrendingUp, User, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  totalHours: number;
  certificates: number;
  currentCourses: Array<{
    id: string;
    title: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    nextLesson?: string;
  }>;
  recentActivities: Array<{
    id: string;
    type: 'lesson' | 'course' | 'certificate';
    title: string;
    date: string;
    description: string;
  }>;
}

interface DashboardProps {
  stats: DashboardStats;
  onCourseSelect: (courseId: string) => void;
  onLessonSelect: (courseId: string, lessonId: string) => void;
  userName?: string;
  userAvatar?: string;
}

export const Dashboard = ({ stats, onCourseSelect, onLessonSelect, userName = "أحمد محمد", userAvatar }: DashboardProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="w-4 h-4" />;
      case 'course': return <TrendingUp className="w-4 h-4" />;
      case 'certificate': return <Trophy className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'text-blue-600';
      case 'course': return 'text-green-600';
      case 'certificate': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* User Welcome Section */}
      <div className="text-center space-y-4 py-6">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 border-primary/20">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              مرحباً، {userName}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              استثمر في رحلة التعلم وطور مهاراتك
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="text-center">
          <CardContent className="pt-4 pb-3">
            <div className="flex flex-col items-center space-y-2">
              <BookOpen className="h-8 w-8 text-primary mb-1" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.enrolledCourses}</div>
              <p className="text-xs text-muted-foreground">دورات نشطة</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-4 pb-3">
            <div className="flex flex-col items-center space-y-2">
              <TrendingUp className="h-8 w-8 text-green-600 mb-1" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.completedCourses}</div>
              <p className="text-xs text-muted-foreground">دورات مكتملة</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-4 pb-3">
            <div className="flex flex-col items-center space-y-2">
              <Trophy className="h-8 w-8 text-yellow-600 mb-1" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.certificates}</div>
              <p className="text-xs text-muted-foreground">الشهادات</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-4 pb-3">
            <div className="flex flex-col items-center space-y-2">
              <Clock className="h-8 w-8 text-blue-600 mb-1" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.totalHours}</div>
              <p className="text-xs text-muted-foreground">ساعات التعلم</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Courses */}
      <Card>
        <CardHeader>
          <CardTitle>الدورات الحالية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.currentCourses.map((course) => (
            <div key={course.id} className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                <h4 className="font-semibold text-base">{course.title}</h4>
                <Badge variant={course.progress === 100 ? "default" : "secondary"} className="self-start">
                  {Math.round(course.progress)}% مكتمل
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Progress value={course.progress} className="h-3" />
                <p className="text-sm text-muted-foreground text-center">
                  {course.completedLessons} من {course.totalLessons} دروس
                </p>
              </div>
              
              <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 md:space-x-reverse">
                {course.nextLesson && (
                  <Button 
                    className="w-full md:w-auto"
                    size="sm" 
                    onClick={() => onLessonSelect(course.id, course.nextLesson!)}
                  >
                    متابعة التعلم
                  </Button>
                )}
                <Button 
                  className="w-full md:w-auto"
                  size="sm" 
                  variant="outline"
                  onClick={() => onCourseSelect(course.id)}
                >
                  عرض الدورة
                </Button>
              </div>
            </div>
          ))}
          
          {stats.currentCourses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-2" />
              <p>لم تسجل في أي دورة بعد</p>
              <Button className="mt-4" onClick={() => window.location.href = '/'}>
                تصفح الدورات
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>الأنشطة الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            ))}
            
            {stats.recentActivities.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p>لا توجد أنشطة حديثة</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};