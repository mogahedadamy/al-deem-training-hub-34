import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Mail, Phone, Calendar, BookOpen, Award, 
  Settings, Edit, Camera, Download, Trophy,
  Clock, CheckCircle, Star, TrendingUp
} from "lucide-react";
import { getCourseById } from "@/data/courses";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Profile = () => {
  const { state } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(state.user || {
    id: '',
    name: '',
    email: '',
    phone: '',
    bio: '',
    enrolledCourses: [],
    completedCourses: [],
    certificates: [],
    joinDate: '',
    role: 'student' as const
  });

  if (!state.user) {
    return (
      <div className="min-h-screen pt-16 md:pt-20">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold font-cairo mb-4">يجب تسجيل الدخول أولاً</h1>
          <Link to="/auth">
            <Button className="font-cairo">تسجيل الدخول</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const enrolledCourses: any[] = []; // Simplified for now
  const completedCourses: any[] = []; // Simplified for now

  const totalProgress = enrolledCourses.length > 0 
    ? (completedCourses.length / enrolledCourses.length) * 100 
    : 0;

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <Header />
      
      {/* Profile Header */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-secondary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-32 w-80 h-80 bg-gradient-primary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-elegant">
                <AvatarImage src="" alt={state.user?.email} />
                <AvatarFallback className="bg-gradient-primary text-white text-3xl font-cairo">
                  {(state.user?.email || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-primary hover:bg-primary-dark"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-3xl md:text-4xl font-bold font-cairo mb-2">
                {state.user?.email}
              </h1>
              <p className="text-muted-foreground font-cairo mb-4">
                {'لم يتم إضافة نبذة شخصية بعد'}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-cairo">انضم في {new Date().toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-cairo">{enrolledCourses.length} دورات مسجلة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span className="font-cairo">{completedCourses.length} دورات مكتملة</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-card border">
                <div className="text-3xl font-bold text-primary font-cairo mb-2">
                  {Math.round(totalProgress)}%
                </div>
                <div className="text-sm text-muted-foreground font-cairo mb-3">
                  معدل الإنجاز
                </div>
                <Progress value={totalProgress} className="h-2 w-24" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
              <TabsTrigger value="overview" className="font-cairo">نظرة عامة</TabsTrigger>
              <TabsTrigger value="courses" className="font-cairo">دوراتي</TabsTrigger>
              <TabsTrigger value="certificates" className="font-cairo">الشهادات</TabsTrigger>
              <TabsTrigger value="settings" className="font-cairo">الإعدادات</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <Card className="border-0 shadow-card bg-gradient-card">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-2xl font-bold font-cairo mb-1">
                      {enrolledCourses.length}
                    </div>
                    <div className="text-muted-foreground font-cairo">
                      دورات مسجلة
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-card bg-gradient-card">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold font-cairo mb-1">
                      {completedCourses.length}
                    </div>
                    <div className="text-muted-foreground font-cairo">
                      دورات مكتملة
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-card bg-gradient-card">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold font-cairo mb-1">
                      0
                    </div>
                    <div className="text-muted-foreground font-cairo">
                      شهادات محصلة
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border-0 shadow-card bg-gradient-card">
                <CardHeader>
                  <CardTitle className="font-cairo">النشاط الأخير</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium font-cairo">أكملت دورة السلامة والصحة المهنية</p>
                      <p className="text-sm text-muted-foreground font-cairo">منذ أسبوع</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium font-cairo">سجلت في دورة تطوير الذات والقيادة</p>
                      <p className="text-sm text-muted-foreground font-cairo">منذ أسبوعين</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {enrolledCourses.map((course) => {
                  const IconComponent = course.icon;
                  const isCompleted = completedCourses.some(c => c.id === course.id);
                  
                  return (
                    <Card key={course.id} className="border-0 shadow-card bg-gradient-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`bg-gradient-to-r ${course.gradient} p-3 rounded-xl`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="font-cairo text-lg">{course.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-cairo">{course.rating}</span>
                              </div>
                            </div>
                          </div>
                          {isCompleted && (
                            <Badge className="bg-green-500 text-white font-cairo">
                              مكتملة
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Progress value={isCompleted ? 100 : 45} className="h-2" />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-cairo">
                              {isCompleted ? "مكتملة" : "45% مكتملة"}
                            </span>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span className="font-cairo">{course.duration}</span>
                            </div>
                          </div>
                          <Link to={`/course/${course.id}`}>
                            <Button variant="outline" className="w-full font-cairo">
                              {isCompleted ? "مراجعة الدورة" : "متابعة التعلم"}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Certificates Tab */}
            <TabsContent value="certificates" className="space-y-6">
              {false ? ( // Simplified for now
                <div className="grid md:grid-cols-2 gap-6">
                  {/* certificates would be mapped here */}
                </div>
              ) : (
                <Card className="border-0 shadow-card bg-gradient-card">
                  <CardContent className="p-12 text-center">
                    <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold font-cairo mb-2">لا توجد شهادات بعد</h3>
                    <p className="text-muted-foreground font-cairo mb-6">
                      أكمل الدورات للحصول على شهادات معتمدة
                    </p>
                    <Link to="/#courses">
                      <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white font-cairo">
                        تصفح الدورات
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="border-0 shadow-card bg-gradient-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-cairo">المعلومات الشخصية</CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="font-cairo"
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      {isEditing ? "إلغاء" : "تعديل"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-cairo">الاسم الكامل</Label>
                      <Input
                        id="name"
                        value={userInfo.email || state.user?.email || ''}
                        disabled={!isEditing}
                        className="font-cairo"
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-cairo">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userInfo.email || state.user?.email || ''}
                        disabled={!isEditing}
                        className="font-cairo"
                        dir="ltr"
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-cairo">رقم الجوال</Label>
                      <Input
                        id="phone"
                        value={userInfo.email || state.user?.email || ''}
                        disabled={!isEditing}
                        className="font-cairo"
                        dir="ltr"
                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="font-cairo">نبذة شخصية</Label>
                    <Textarea
                      id="bio"
                      value={userInfo.email || ''}
                      disabled={!isEditing}
                      className="font-cairo"
                      rows={3}
                      onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                    />
                  </div>
                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white font-cairo">
                        حفظ التغييرات
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="font-cairo">
                        إلغاء
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;