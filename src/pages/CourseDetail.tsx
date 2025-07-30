import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, Users, Award, Star, CheckCircle, PlayCircle, 
  BookOpen, Target, Globe, Calendar, ArrowRight, Heart,
  ArrowLeft
} from "lucide-react";
import { getCourseById } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/utils/currency";
import { usePayment } from "@/contexts/PaymentContext";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, enrollInCourse, isEnrolledInCourse } = useAuth();
  const { getTransactionByCourse } = usePayment();
  const course = id ? getCourseById(id) : null;
  
  // Check if user has a verified payment for this course
  const userTransaction = state.user ? getTransactionByCourse(state.user.id, id || '') : null;
  const hasVerifiedPayment = userTransaction?.status === 'verified';

  const handleEnrollment = () => {
    if (!state.isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: `/course/${id}` } } });
      return;
    }

    // If user has verified payment, enroll directly
    if (hasVerifiedPayment && course && !isEnrolledInCourse(course.id)) {
      enrollInCourse(course.id);
    } else if (course) {
      // Otherwise, redirect to payment page
      navigate(`/payment/${course.id}`);
    }
  };

  const handleStartLearning = () => {
    if (course && course.lessons.length > 0) {
      navigate(`/course/${course.id}/lesson/${course.lessons[0].id}`);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen pt-16 md:pt-20">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">الدورة غير موجودة</h1>
          <Link to="/">
            <Button>العودة للصفحة الرئيسية</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = course.icon;

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <ArrowLeft className="w-4 h-4" />
            <Link to="/#courses" className="hover:text-primary transition-colors">الدورات</Link>
            <ArrowLeft className="w-4 h-4" />
            <span className="text-foreground">{course.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-32 w-80 h-80 bg-gradient-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-32 w-96 h-96 bg-gradient-accent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className={`bg-gradient-to-r ${course.gradient} p-4 rounded-2xl shadow-hover`}>
                  <IconComponent className="w-10 h-10 text-white drop-shadow-sm" />
                </div>
                {course.badge && (
                  <Badge className="bg-gradient-primary text-white border-0 shadow-hover font-cairo">
                    {course.badge}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-cairo leading-tight">
                {course.title}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-cairo">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold font-cairo">{course.rating}</span>
                  <span className="text-muted-foreground font-cairo">({course.students} طالب)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-cairo">{course.totalHours} ساعة</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="font-cairo">{course.language}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="font-cairo">{course.level}</span>
                </div>
              </div>

              {/* Instructor */}
              <Card className="mb-8 border-0 shadow-card bg-gradient-card">
                <CardHeader>
                  <CardTitle className="font-cairo">المدرب</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                      <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                      <AvatarFallback className="bg-gradient-primary text-white font-cairo">
                        {course.instructor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg font-cairo">{course.instructor.name}</h3>
                      <p className="text-muted-foreground font-cairo">{course.instructor.bio}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-primary">
                        <Calendar className="w-4 h-4" />
                        <span className="font-cairo">خبرة {course.instructor.experience}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-0 shadow-elegant bg-gradient-card">
                <CardHeader className="text-center">
                  <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent font-cairo mb-2">
                    {formatPrice(course.price)}
                  </div>
                  {state.isAuthenticated && isEnrolledInCourse(course.id) ? (
                    <Button 
                      onClick={handleStartLearning}
                      className="w-full bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 text-white border-0 shadow-hover font-cairo"
                    >
                      <PlayCircle className="w-5 h-5 ml-2" />
                      ابدأ التعلم
                    </Button>
                  ) : state.isAuthenticated && hasVerifiedPayment ? (
                    <Button 
                      onClick={handleEnrollment}
                      className="w-full bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 text-white border-0 shadow-hover font-cairo"
                    >
                      <CheckCircle className="w-5 h-5 ml-2" />
                      سجل في الدورة
                    </Button>
                  ) : state.isAuthenticated && userTransaction?.status === 'verification_submitted' ? (
                    <div className="space-y-3">
                      <Button 
                        disabled
                        className="w-full bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 text-white border-0 shadow-hover font-cairo opacity-60"
                      >
                        <Clock className="w-5 h-5 ml-2" />
                        جاري التحقق من الدفعة
                      </Button>
                      <p className="text-xs text-center text-muted-foreground font-cairo">
                        سيتم مراجعة دفعتك خلال 24 ساعة
                      </p>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleEnrollment}
                      className="w-full bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 text-white border-0 shadow-hover font-cairo"
                    >
                      <Heart className="w-5 h-5 ml-2" />
                      {state.isAuthenticated ? 'ادفع واشترك' : 'سجل للالتحاق'}
                    </Button>
                  )}
                  
                  {state.isAuthenticated && isEnrolledInCourse(course.id) && (
                    <div className="mt-4">
                      <Link to={`/course/${course.id}/exam`}>
                        <Button 
                          variant="outline"
                          className="w-full font-cairo border-primary text-primary hover:bg-primary hover:text-white"
                        >
                          <Award className="w-5 h-5 ml-2" />
                          الاختبار النهائي
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-cairo">المدة</span>
                      <span className="font-medium font-cairo">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-cairo">المستوى</span>
                      <span className="font-medium font-cairo">{course.level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-cairo">عدد الطلاب</span>
                      <span className="font-medium font-cairo">{course.students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-cairo">الشهادة</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-bold mb-3 font-cairo">ما ستتعلمه:</h4>
                    <div className="space-y-2">
                      {course.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm font-cairo">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 font-cairo">محتوى الدورة</h2>
          
          {course.lessons.length > 0 ? (
            <div className="space-y-4">
              {course.lessons.map((lesson, index) => (
                <Card 
                  key={lesson.id} 
                  className={`border-0 shadow-card bg-gradient-card hover:shadow-hover transition-all duration-300 ${
                    state.isAuthenticated && isEnrolledInCourse(course.id) ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => {
                    if (state.isAuthenticated && isEnrolledInCourse(course.id)) {
                      navigate(`/course/${course.id}/lesson/${lesson.id}`);
                    }
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-primary/10 p-3 rounded-lg">
                          <PlayCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg font-cairo">{lesson.title}</h3>
                          <p className="text-muted-foreground font-cairo">{lesson.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="font-cairo">{lesson.duration} دقيقة</span>
                        {!(state.isAuthenticated && isEnrolledInCourse(course.id)) && (
                          <div className="bg-muted/50 px-2 py-1 rounded text-xs font-cairo">
                            مُؤمّن
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-card bg-gradient-card">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 font-cairo">محتوى الدورة قيد التحضير</h3>
                <p className="text-muted-foreground font-cairo">سيتم إضافة محتوى الدورة قريباً</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Prerequisites */}
      {course.prerequisites.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 font-cairo">المتطلبات المسبقة</h2>
            <Card className="border-0 shadow-card bg-gradient-card">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {course.prerequisites.map((prerequisite, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="font-cairo">{prerequisite}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default CourseDetail;