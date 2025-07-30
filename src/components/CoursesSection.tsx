import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Award, BookOpen, Shield, TrendingUp, CheckSquare, Settings, Star, Sparkles, Heart } from "lucide-react";
import { courses } from "@/data/courses";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/currency";
import { useAuth } from "@/contexts/AuthContext";
import { usePayment } from "@/contexts/PaymentContext";
const CoursesSection = () => {
  const {
    state: authState,
    hasPaidForCourse
  } = useAuth();
  const {
    getTransactionByCourse
  } = usePayment();
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
    const hasPaid = hasPaidForCourse(course.id);
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
  return <section id="courses" className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4 md:mb-6 font-cairo leading-tight">
            برامجنا
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-cairo">
            نقدم مجموعة متنوعة من البرامج التدريبية المتخصصة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {courses.map((course, index) => <Card key={index} className="bg-white border border-border hover:shadow-soft transition-shadow">
              {/* Badge */}
              {course.badge && <div className="absolute top-4 right-4 z-10">
                  <Badge variant="accent" className="text-xs font-cairo">
                    {course.badge}
                  </Badge>
                </div>}

              <CardHeader className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-accent/10">
                    <course.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold font-cairo">{course.rating}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-cairo">{course.students} طالب</div>
                  </div>
                </div>
                <CardTitle className="text-lg font-bold text-primary mb-3 font-cairo">{course.title}</CardTitle>
                <p className="text-muted-foreground text-sm font-cairo line-clamp-3">{course.description}</p>
              </CardHeader>
              
              <CardContent className="px-6 pb-6">
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="font-cairo">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-accent" />
                    <span className="font-cairo">{course.level}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-xl font-bold text-primary font-cairo">
                    {formatPrice(course.price)}
                  </div>
                  <Button className="bg-accent hover:bg-accent/90 text-white px-4 py-2 text-sm font-cairo" asChild>
                    <Link to={!authState.isAuthenticated ? "/auth" : `${hasPaidForCourse(course.id) ? `/course/${course.id}` : `/payment/${course.id}`}`}>
                      اشترك الآن
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>

      </div>
    </section>;
};
export default CoursesSection;