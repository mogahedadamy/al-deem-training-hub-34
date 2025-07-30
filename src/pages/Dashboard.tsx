import { Link, useNavigate } from "react-router-dom";
import { Play, Award, Clock, TrendingUp, BookOpen, User, PlayCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { getCourseById } from "@/data/courses";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Dashboard as DashboardComponent } from "@/components/dashboard/Dashboard";
import { getDashboardStats, sampleUser } from "@/data/users";
import { courses } from "@/data/courses";

const Dashboard = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  
  if (!state.user) {
    return null;
  }
  
  const stats = getDashboardStats(state.user);

  // الحصول على الدورات المسجلة للمستخدم الحالي
  const enrolledCourses = state.user.enrolledCourses.map(courseId => getCourseById(courseId)).filter(Boolean);
  const completedCourses = state.user.completedCourses.map(courseId => getCourseById(courseId)).filter(Boolean);
  
  // إنشاء بيانات الدورات الحالية
  const currentCourses = enrolledCourses.map(course => {
    if (!course) return null;
    const isCompleted = state.user?.completedCourses.includes(course.id);
    const progressPercentage = isCompleted ? 100 : Math.floor(Math.random() * 60) + 20;
    
    return {
      id: course.id,
      title: course.title,
      progress: progressPercentage,
      completedLessons: isCompleted ? course.lessons.length : Math.floor((progressPercentage / 100) * course.lessons.length),
      totalLessons: course.lessons.length,
      nextLesson: course.lessons[0]?.id || '',
      course
    };
  }).filter(Boolean);

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* ترحيب المستخدم */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={state.user.avatar} alt={state.user.name} />
              <AvatarFallback className="bg-primary text-white text-xl font-cairo">
                {state.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground font-cairo">مرحباً، {state.user.name}</h1>
              <p className="text-muted-foreground font-cairo">استمر في رحلة التعلم وطور مهاراتك</p>
            </div>
          </div>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center border-0 shadow-card bg-gradient-card">
            <CardContent className="p-4">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold font-cairo">{enrolledCourses.length}</div>
              <div className="text-sm text-muted-foreground font-cairo">دورات نشطة</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-card bg-gradient-card">
            <CardContent className="p-4">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold font-cairo">{state.user.completedCourses.length}</div>
              <div className="text-sm text-muted-foreground font-cairo">دورات مكتملة</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-card bg-gradient-card">
            <CardContent className="p-4">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold font-cairo">
                {enrolledCourses.reduce((sum, course) => sum + (course?.totalHours || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground font-cairo">ساعات التعلم</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-card bg-gradient-card">
            <CardContent className="p-4">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold font-cairo">{state.user.certificates.length}</div>
              <div className="text-sm text-muted-foreground font-cairo">الشهادات</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* الدورات الحالية */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cairo">
                  <BookOpen className="h-5 w-5" />
                  دوراتي الحالية
                </CardTitle>
                <CardDescription className="font-cairo">
                  استمر في التعلم وأكمل الدورات التي بدأتها
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentCourses.map(courseData => {
                  if (!courseData) return null;
                  
                  return (
                    <div key={courseData.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-background/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 font-cairo">{courseData.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2 font-cairo">
                            {courseData.completedLessons} من {courseData.totalLessons} دروس مكتملة
                          </p>
                          <Progress value={courseData.progress} className="mb-2" />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-cairo">{courseData.progress}% مكتمل</span>
                            <Badge variant="outline" className="font-cairo">
                              {courseData.course?.level || "جميع المستويات"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          className="bg-gradient-primary hover:shadow-glow font-cairo"
                          onClick={() => {
                            if (courseData.nextLesson) {
                              navigate(`/course/${courseData.id}/lesson/${courseData.nextLesson}`);
                            }
                          }}
                        >
                          <PlayCircle className="h-4 w-4 ml-2" />
                          متابعة التعلم
                        </Button>
                        <Button variant="outline" size="sm" asChild className="font-cairo">
                          <Link to={`/course/${courseData.id}`}>
                            عرض التفاصيل
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                {currentCourses.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-cairo">لم تسجل في أي دورة بعد</p>
                    <Button asChild className="mt-4 bg-gradient-primary hover:shadow-glow font-cairo">
                      <Link to="/#courses">استكشف الدورات</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* الأنشطة الأخيرة */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>الأنشطة الأخيرة</CardTitle>
                <CardDescription>آخر الأنشطة والإنجازات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`
                        p-2 rounded-full
                        ${activity.type === 'lesson' ? 'bg-blue-100 text-blue-600' : ''}
                        ${activity.type === 'course' ? 'bg-green-100 text-green-600' : ''}
                        ${activity.type === 'certificate' ? 'bg-purple-100 text-purple-600' : ''}
                      `}>
                        {activity.type === 'lesson' && <Play className="h-4 w-4" />}
                        {activity.type === 'course' && <BookOpen className="h-4 w-4" />}
                        {activity.type === 'certificate' && <Award className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* إحصائيات إضافية */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>إحصائيات التقدم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>معدل الإكمال</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>ساعات هذا الأسبوع</span>
                      <span>12 ساعة</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>نقاط الإنجاز</span>
                      <span>2,450</span>
                    </div>
                    <Progress value={75} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* اقتراحات الدورات */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>دورات موصى بها لك</CardTitle>
            <CardDescription>بناءً على اهتماماتك وتقدمك الحالي</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.slice(0, 3).map(course => (
                <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <course.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">{course.duration}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {course.description.slice(0, 80)}...
                  </p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={`/course/${course.id}`}>
                      عرض التفاصيل
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;