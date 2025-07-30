import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Award, BookOpen } from "lucide-react";

const TeamSection = () => {
  const trainers = [
    {
      name: "د. مهند حسن",
      title: "خبير الجودة والاعتماد",
      specialization: "إدارة الجودة الشاملة",
      experience: "15+ سنة خبرة",
      icon: Award,
      gradient: "from-primary to-secondary"
    },
    {
      name: "بروف ضياء الدين محمد الحسن",
      title: "عميد كلية التربية",
      specialization: "التربية والتعليم",
      experience: "20+ سنة خبرة",
      icon: GraduationCap,
      gradient: "from-secondary to-primary"
    },
    {
      name: "بروف الطيب إبراهيم",
      title: "المدير السابق",
      specialization: "الإدارة الاستراتيجية",
      experience: "18+ سنة خبرة",
      icon: Users,
      gradient: "from-primary to-accent"
    },
    {
      name: "أ. معتز محجوب",
      title: "مدرب معتمد",
      specialization: "التطوير المهني",
      experience: "12+ سنة خبرة",
      icon: BookOpen,
      gradient: "from-accent to-secondary",
      photo: "/lovable-uploads/f393a4e7-823b-4289-a00b-705a7b72c8c5.png"
    },
    {
      name: "م. عمر التهامي",
      title: "مدرب معتمد",
      specialization: "الهندسة والإدارة",
      experience: "10+ سنة خبرة",
      icon: Award,
      gradient: "from-secondary to-primary",
      photo: "/lovable-uploads/a4d89071-b28a-4468-a44d-34ba95f181e6.png"
    },
    {
      name: "د. أحمد موسى",
      title: "أستاذ إدارة الأعمال",
      specialization: "إدارة الأعمال الحديثة",
      experience: "14+ سنة خبرة",
      icon: GraduationCap,
      gradient: "from-primary to-accent",
      photo: "/lovable-uploads/d108ca26-bf9e-4b4b-9aa6-7ddcb8db0d34.png"
    }
  ];

  return (
    <section id="team" className="py-12 md:py-16 bg-gradient-to-br from-background to-muted/20 relative overflow-hidden border-b border-primary/10">
      {/* Section Separator */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-primary rounded-full"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 left-20 w-80 h-80 bg-gradient-secondary rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-gradient-primary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-8 md:mb-12 pt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 rounded-full px-4 md:px-6 py-2 md:py-3 mb-4 md:mb-6 animate-fade-in">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-primary drop-shadow-sm" />
            <span className="text-primary font-semibold text-base md:text-lg font-cairo">فريق الخبراء</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 md:mb-6 animate-fade-in font-cairo leading-tight">
            نخبة من المدربين المتخصصين
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto animate-fade-in leading-relaxed font-cairo px-4" style={{ animationDelay: "0.2s" }}>
            فريق متميز من الأكاديميين والخبراء المعتمدين في مختلف المجالات التدريبية والإدارية
          </p>
          
          {/* صورة الفريق والأنشطة */}
          <div className="mt-8 md:mt-12 animate-fade-in" style={{ animationDelay: "0.25s" }}>
            <div className="relative max-w-4xl mx-auto">
              <img 
                src="/lovable-uploads/296bded3-68f3-4512-8b3b-de7cfeb9cbe3.png" 
                alt="فريق مركز العميد للتدريب المتقدم وأنشطته التدريبية"
                className="w-full h-auto rounded-2xl shadow-elegant border border-primary/20 hover:shadow-glow transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent rounded-2xl"></div>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-sm md:text-base font-medium text-white bg-primary/90 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-lg inline-block shadow-elegant font-cairo">
                  فريق من الخبراء والمتخصصين
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          {trainers.map((trainer, index) => (
            <Card key={index} className="group border-0 shadow-card hover:shadow-elegant transition-all duration-500 hover:scale-105 bg-gradient-card overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="text-center">
                  {trainer.photo ? (
                    <div className="relative mb-6 mx-auto">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-elegant group-hover:shadow-glow transition-all duration-300 mx-auto border-4 border-primary/20 group-hover:border-primary/40">
                        <img 
                          src={trainer.photo} 
                          alt={trainer.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      {/* Badge overlay */}
                      <div className="absolute -bottom-2 -right-2">
                        <div className={`bg-gradient-to-r ${trainer.gradient} p-2 rounded-full shadow-hover group-hover:shadow-glow transition-all duration-300`}>
                          <trainer.icon className="w-4 h-4 text-white drop-shadow-sm" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`bg-gradient-to-r ${trainer.gradient} p-4 rounded-2xl shadow-hover group-hover:shadow-glow transition-all duration-300 mb-6 mx-auto w-fit`}>
                      <trainer.icon className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-sm" />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 font-cairo leading-tight">
                      {trainer.name}
                    </h3>
                    
                    <div className="space-y-2">
                      <p className="text-primary font-semibold text-lg font-cairo">
                        {trainer.title}
                      </p>
                      
                      <p className="text-muted-foreground text-base font-cairo leading-relaxed">
                        {trainer.specialization}
                      </p>
                    </div>
                    
                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 bg-gradient-primary/10 hover:bg-gradient-primary/20 rounded-full px-4 py-2 transition-all duration-300">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary font-medium font-cairo">
                          {trainer.experience}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certification Info */}
        <div className="mt-12 md:mt-16 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="inline-flex items-center gap-3 bg-gradient-primary/10 rounded-full px-6 py-4 border border-primary/20">
            <Award className="w-6 h-6 text-primary" />
            <span className="text-primary font-semibold font-cairo">
              مركز معتمد ومسجل تحت رقم 1016
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;