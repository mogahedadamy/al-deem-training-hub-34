import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Award, BookOpen, Shield, TrendingUp, CheckSquare, Settings, Star, Sparkles, Heart } from "lucide-react";
import { courses } from "@/data/courses";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/currency";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { usePayment } from "@/contexts/PaymentContext";
import { useCourseEnrollments } from "@/hooks/useCourseEnrollments";
const CoursesSection = () => {
  const {
    state: authState
  } = useAuth();
  const {
    getTransactionByCourse
  } = usePayment();
  const { getEnrollmentCount } = useCourseEnrollments();
  const getEnrollmentButton = (course: any) => {
    if (!authState.isAuthenticated) {
      return <Button className="bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 px-3 md:px-6 py-2 md:py-2 text-white border-0 shadow-hover text-sm md:text-base font-cairo w-full sm:w-auto" asChild>
          <Link to="/auth">
            <Heart className="w-3 h-3 md:w-5 md:h-5 ml-2" />
            سجل الآن
          </Link>
        </Button>;
    }
    const transaction = getTransactionByCourse(authState.user!.id, course.id);
    const hasPaid = false; // Simplified for now
    if (transaction) {
      if (transaction.status === 'verified' || hasPaid) {
        return <Button className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-300 px-3 md:px-6 py-2 md:py-2 text-white border-0 shadow-hover text-sm md:text-base font-cairo w-full sm:w-auto" asChild>
            <Link to={`/course/${course.id}`}>
              <CheckSquare className="w-3 h-3 md:w-5 md:h-5 ml-2" />
              دخول الدورة
            </Link>
          </Button>;
      } else if (transaction.status === 'verification_submitted') {
        return <Button disabled className="bg-blue-600 cursor-not-allowed px-3 md:px-6 py-2 md:py-2 text-white border-0 text-sm md:text-base font-cairo w-full sm:w-auto">
            <Clock className="w-3 h-3 md:w-5 md:h-5 ml-2" />
            في انتظار التحقق
          </Button>;
      } else if (transaction.status === 'rejected') {
        return <Button className="bg-orange-600 hover:bg-orange-700 hover:scale-105 transition-all duration-300 px-3 md:px-6 py-2 md:py-2 text-white border-0 shadow-hover text-sm md:text-base font-cairo w-full sm:w-auto" asChild>
            <Link to={`/payment/${course.id}`}>
              <Heart className="w-3 h-3 md:w-5 md:h-5 ml-2" />
              إعادة المحاولة
            </Link>
          </Button>;
      }
    }

    // Default: show payment button
    return <Button className="bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 px-3 md:px-6 py-2 md:py-2 text-white border-0 shadow-hover text-sm md:text-base font-cairo w-full sm:w-auto" asChild>
        <Link to={`/payment/${course.id}`}>
          <Heart className="w-3 h-3 md:w-5 md:h-5 ml-2" />
          سجل الآن
        </Link>
      </Button>;
  };
  return <section id="courses" className="py-12 md:py-16 relative overflow-hidden border-b border-primary/10">
      {/* Section Separator */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-accent rounded-full animate-fade-in"></div>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-40 left-32 w-80 h-80 bg-gradient-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-32 w-96 h-96 bg-gradient-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-8 md:mb-12 pt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 rounded-full px-4 md:px-6 py-2 md:py-3 mb-4 md:mb-6 animate-fade-in">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary drop-shadow-sm" />
            <span className="text-primary font-semibold text-base md:text-lg font-cairo">دوراتنا التدريبية</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 md:mb-6 animate-fade-in font-cairo leading-tight">
            برامج تدريبية متميزة
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto animate-fade-in leading-relaxed font-cairo px-4" style={{
          animationDelay: "0.2s"
        }}>
            نقدم مجموعة متنوعة من الدورات التدريبية المتخصصة لتطوير مهاراتك المهنية وتحقيق أهدافك
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-16">
          {courses.map((course, index) => <Card key={index} className="group border-0 shadow-card hover:shadow-elegant transition-all duration-500 hover:scale-105 bg-gradient-card animate-fade-in relative overflow-hidden" style={{
          animationDelay: `${0.1 * index}s`
        }}>
              {/* Badge */}
              {course.badge && <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
                  <Badge className="bg-gradient-primary text-white border-0 shadow-hover text-xs font-cairo my-[10px] px-[5px] py-[3px] mx-[42px]">
                    {course.badge}
                  </Badge>
                </div>}

              {/* Course Thumbnail */}
              {course.thumbnail && (
                <div className="h-48 md:h-56 overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}

              <CardHeader className="pb-2 md:pb-4 relative p-3 md:p-6">
                <div className="flex items-center justify-between mb-2 md:mb-6">
                  <div className={`bg-gradient-to-r ${course.gradient} p-2 md:p-4 rounded-lg md:rounded-2xl shadow-hover group-hover:shadow-glow transition-all duration-300 flex-shrink-0`}>
                    <course.icon className="w-5 h-5 md:w-9 md:h-9 text-white drop-shadow-sm" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                      <Star className="w-3 h-3 md:w-5 md:h-5 fill-current drop-shadow-sm" />
                      <span className="text-xs font-bold font-cairo">{course.rating}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-cairo">{getEnrollmentCount(course.id)} طالب</div>
                  </div>
                </div>
                <CardTitle className="text-base md:text-xl lg:text-2xl font-bold text-secondary mb-2 md:mb-3 group-hover:text-primary transition-colors duration-300 font-cairo leading-tight">{course.title}</CardTitle>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-cairo line-clamp-3">{course.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-2 md:space-y-6 px-3 md:px-6 pb-3 md:pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary drop-shadow-sm flex-shrink-0" />
                     <span className="font-medium font-cairo">{course.duration}</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Award className="w-4 h-4 md:w-5 md:h-5 text-primary drop-shadow-sm flex-shrink-0" />
                    <span className="font-medium font-cairo">{course.level}</span>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  {course.features.slice(0, 2).map((feature, featureIndex) => <div key={featureIndex} className="flex items-center gap-3 md:gap-4">
                      <div className="w-2 h-2 md:w-2 md:h-2 bg-gradient-primary rounded-full flex-shrink-0"></div>
                      <span className="text-foreground font-medium text-sm md:text-base font-cairo">{feature}</span>
                    </div>)}
                </div>

                <div className="flex items-center justify-between pt-2 md:pt-4 border-t border-border/50">
                  <div className="text-sm md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent font-cairo">
                    {formatPrice(course.price)}
                  </div>
                  {getEnrollmentButton(course)}
                </div>
              </CardContent>
            </Card>)}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="animate-fade-in border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 px-6 md:px-8 py-3 text-base md:text-lg font-cairo" style={{
          animationDelay: "0.8s"
        }}>
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 ml-3" />
            عرض جميع الدورات
          </Button>
        </div>
      </div>
    </section>;
};
export default CoursesSection;