import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Calendar, Award, Target, CheckCircle } from "lucide-react";
const TrainingPlanSection = () => {
  const trainingPrograms = ["التخطيط الاستراتيجي وإعداد الخطط التنفيذية", "تدريب المدربين (TOT)", "إدارة الموارد البشرية", "التميز في القيادة الإدارية", "بروتوكول إدارة الاجتماعات", "مناهج البحث العلمي", "مهارات إعداد وكتابة التقارير", "برامج الجودة الشاملة", "إدارة الوقت والتدريب على إعداد خطط زمنية", "إدارة المشاريع الاحترافية (PMP)", "الصحة والسلامة المهنية", "إدارة المخاطر", "العلاقات العامة", "الخدمات اللوجستية", "التميز المؤسسي", "السكرتارية التنفيذية وإدارة المكاتب", "إدارة الأزمات والكوارث وتخطيط الوقت", "الماجستير المهني المصغر في إدارة الأعمال", "آيزو 9001", "السبورة الذكية التفاعلية", "المحاسبة الإلكترونية", "التحليل الإحصائي (SPSS)", "التميز في خدمة العملاء", "طرائق التدريس الجامعي", "كورسات اللغة الإنجليزية", "كورسات العمل الطوعي", "إعداد وثائق النظام الإداري", "قياس مؤشرات الأداء", "نظام الإدارة المتكامل", "إدارة المخازن والمحاسبة المالية"];
  const planFeatures = [{
    icon: Calendar,
    title: "خطة سنوية شاملة",
    description: "برامج تدريبية مجدولة بمعدل 4 برامج شهرياً",
    gradient: "from-primary to-secondary"
  }, {
    icon: Users,
    title: "فئات متنوعة",
    description: "تدريب كادر المركز والأفراد والمؤسسات",
    gradient: "from-secondary to-accent"
  }, {
    icon: Award,
    title: "شهادات معتمدة",
    description: "شهادات حضور وإنجاز معتمدة محلياً ودولياً",
    gradient: "from-accent to-primary"
  }];
  const objectives = ["التعريف بمراحل العملية التدريبية في جانبيها العلمي والعملي", "إكساب المشاركين المعرفة بطرق وأساليب إعداد خطة التدريب للوظيفة وللموظف", "أشكال ومراحل تنفيذ خطة التدريب", "تزويد المشاركين بالجانب التطبيقي لتنفيذ خطة التدريب ومراحل تقييم أنشطتها"];
  return <section id="training-plan" className="py-12 md:py-16 bg-gradient-to-br from-muted/20 to-background relative overflow-hidden border-b border-primary/10">
      {/* Section Separator */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-primary rounded-full"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-20 w-96 h-96 bg-gradient-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-8 md:mb-12 pt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 rounded-full px-4 md:px-6 py-2 md:py-3 mb-4 md:mb-6 animate-fade-in">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary drop-shadow-sm" />
            <span className="text-primary font-semibold text-base md:text-lg font-cairo">الخطة التدريبية</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 md:mb-6 animate-fade-in font-cairo leading-tight">
            الخطة التدريبية السنوية 2024-2025
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto animate-fade-in leading-relaxed font-cairo px-4" style={{
          animationDelay: "0.2s"
        }}>
            خطة تدريبية شاملة تهدف إلى إعداد وتنفيذ دورات تدريبية نوعية ومتخصصة في مختلف المجالات الإدارية والفنية والتنموية
          </p>
        </div>

        {/* Plan Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 animate-fade-in" style={{
        animationDelay: "0.3s"
      }}>
          {planFeatures.map((feature, index) => <Card key={index} className="group border-0 shadow-card hover:shadow-elegant transition-all duration-500 hover:scale-105 bg-gradient-card">
              <CardContent className="p-6 md:p-8 text-center">
                <div className={`bg-gradient-to-r ${feature.gradient} p-4 rounded-2xl shadow-hover group-hover:shadow-glow transition-all duration-300 mb-6 mx-auto w-fit`}>
                  <feature.icon className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-sm" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 font-cairo">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-cairo leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>)}
        </div>

        {/* Objectives */}
        <div className="mb-12 animate-fade-in" style={{
        animationDelay: "0.4s"
      }}>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-8 text-center font-cairo">
            أهداف الخطة التدريبية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((objective, index) => <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gradient-card border border-primary/10">
                <div className="bg-gradient-primary p-2 rounded-lg flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <p className="text-foreground font-cairo leading-relaxed">{objective}</p>
              </div>)}
          </div>
        </div>

        {/* Training Programs */}
        <div className="animate-fade-in" style={{
        animationDelay: "0.5s"
      }}>
          
          
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center animate-fade-in" style={{
        animationDelay: "0.6s"
      }}>
          <div className="inline-flex items-center gap-3 bg-gradient-primary/10 rounded-full px-6 py-4 border border-primary/20">
            <Award className="w-6 h-6 text-primary" />
            <span className="text-primary font-semibold font-cairo">
              يمكن التنسيق لبرامج إضافية حسب طلب المؤسسات
            </span>
          </div>
        </div>
      </div>
    </section>;
};
export default TrainingPlanSection;