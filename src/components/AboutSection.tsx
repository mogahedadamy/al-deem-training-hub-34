import { CheckCircle, Target, Users, Award, Sparkles, Trophy, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  const features = [
    {
      icon: Target,
      title: "رؤيتنا",
      description: "الإسهام الفاعل في تطوير المؤسسات وأفراد المجتمع، وذلك من خلال إكسابهم العديد من المهارات المتعددة كلٍ في مجال تخصصه والتي سوف تساهم بدورها في تغيير الاتجاهات نحو العمل بشكل أكثر إبداعا وتميزاً",
      gradient: "from-primary to-secondary"
    },
    {
      icon: Users,
      title: "رسالتنا",
      description: "يتولى المركز تقدير الاحتياجات التدريبية للأفراد، ويعمل على توفيرها لهم من خلال البرامج التدريبية وورش العمل المتنوعة التي تتماشى مع الرؤية التدريبية الحديثة",
      gradient: "from-secondary to-primary"
    },
    {
      icon: Award,
      title: "قيمنا",
      description: "الجودة في الأداء، المصداقية في التعامل، والعمل بروح الفريق الواحد لتحقيق التميز",
      gradient: "from-primary to-accent"
    }
  ];

  const achievements = [
    {
      icon: CheckCircle,
      text: "أكثر من 26000 متدرب تخرجوا من المركز",
      highlight: "26000 متدرب"
    },
    {
      icon: Trophy,
      text: "شراكات مع أفضل المؤسسات التدريبية",
      highlight: "شراكات قوية"
    },
    {
      icon: Sparkles,
      text: "برامج تدريبية متطورة ومحدثة",
      highlight: "برامج متطورة"
    },
    {
      icon: Shield,
      text: "متابعة مستمرة للمتدربين بعد انتهاء الدورة",
      highlight: "متابعة مستمرة"
    }
  ];

  return (
    <section id="about" className="py-12 md:py-16 bg-gradient-to-br from-muted/20 to-background relative overflow-hidden border-b border-primary/10">
      {/* Section Separator */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-primary rounded-full"></div>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-8 md:mb-12 pt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 rounded-full px-4 md:px-6 py-2 md:py-3 mb-4 md:mb-6 animate-fade-in">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary drop-shadow-sm" />
            <span className="text-primary font-semibold text-base md:text-lg font-cairo">عن مركزنا</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 md:mb-6 animate-fade-in font-cairo leading-tight">
            مركز العميد للتدريب المتقدم
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto animate-fade-in leading-relaxed font-cairo px-4" style={{ animationDelay: "0.2s" }}>
            مؤسسة تدريبية رائدة مسجلة ومعتمدة تحت رقم 116313 تسعى لتقديم أفضل البرامج التدريبية المتخصصة في التطوير الإداري والقيادي والتثقيفي
          </p>
          
          {/* صور أنشطة المركز */}
          <div className="mt-8 md:mt-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative max-w-5xl mx-auto">
              <img 
                src="/lovable-uploads/296bded3-68f3-4512-8b3b-de7cfeb9cbe3.png" 
                alt="أنشطة وفعاليات مركز العميد للتدريب المتقدم"
                className="w-full h-auto rounded-2xl shadow-elegant border border-primary/20 hover:shadow-glow transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent rounded-2xl"></div>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-sm md:text-base font-medium text-white bg-primary/90 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-lg inline-block shadow-elegant font-cairo">
                  التدريب يطور القدرات ويوسع الفرص
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-8 md:mb-12">
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6 md:mb-8 font-cairo">لماذا تختار مركز العميد؟</h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="group flex flex-col md:flex-row items-start md:space-x-4 space-y-2 md:space-y-0 p-2 md:p-4 rounded-lg md:rounded-2xl hover:bg-gradient-card hover:shadow-card transition-all duration-300">
                  <div className="bg-gradient-primary p-2 md:p-3 rounded-lg md:rounded-2xl shadow-hover group-hover:shadow-glow transition-all duration-300 flex-shrink-0 mx-auto md:mx-0">
                    <achievement.icon className="w-4 h-4 md:w-7 md:h-7 text-white drop-shadow-sm" />
                  </div>
                  <div className="text-center md:text-right">
                    <span className="text-foreground text-xs md:text-lg leading-relaxed font-cairo">
                      {achievement.text.split(achievement.highlight)[0]}
                      <span className="font-bold text-primary">{achievement.highlight}</span>
                      {achievement.text.split(achievement.highlight)[1]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {features.map((feature, index) => (
              <Card key={index} className="group border-0 shadow-card hover:shadow-elegant transition-all duration-500 hover:scale-105 bg-gradient-card">
                <CardContent className="p-4 md:p-8">
                  <div className="flex items-start space-x-4 md:space-x-6">
                    <div className={`bg-gradient-to-r ${feature.gradient} p-2 md:p-4 rounded-lg md:rounded-2xl shadow-hover group-hover:shadow-glow transition-all duration-300 flex-shrink-0`}>
                      <feature.icon className="w-5 h-5 md:w-9 md:h-9 text-white drop-shadow-sm" />
                    </div>
                    <div>
                      <h4 className="text-base md:text-2xl font-bold text-secondary mb-1 md:mb-3 group-hover:text-primary transition-colors duration-300 font-cairo">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm md:text-lg leading-relaxed font-cairo">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="text-center group">
            <div className="bg-gradient-primary/10 rounded-xl md:rounded-3xl p-3 md:p-8 hover:bg-gradient-primary/20 transition-all duration-300">
              <div className="text-xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-1 md:mb-2 font-cairo">98%</div>
              <div className="text-muted-foreground font-medium text-xs md:text-base font-cairo">معدل النجاح</div>
            </div>
          </div>
          <div className="text-center group">
            <div className="bg-gradient-primary/10 rounded-xl md:rounded-3xl p-3 md:p-8 hover:bg-gradient-primary/20 transition-all duration-300">
              <div className="text-xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-1 md:mb-2 font-cairo">24/7</div>
              <div className="text-muted-foreground font-medium text-xs md:text-base font-cairo">دعم فني</div>
            </div>
          </div>
          <div className="text-center group">
            <div className="bg-gradient-primary/10 rounded-xl md:rounded-3xl p-3 md:p-8 hover:bg-gradient-primary/20 transition-all duration-300">
              <div className="text-xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-1 md:mb-2 font-cairo">15+</div>
              <div className="text-muted-foreground font-medium text-xs md:text-base font-cairo">مجال تخصص</div>
            </div>
          </div>
          <div className="text-center group">
            <div className="bg-gradient-primary/10 rounded-xl md:rounded-3xl p-3 md:p-8 hover:bg-gradient-primary/20 transition-all duration-300">
              <div className="text-xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-1 md:mb-2 font-cairo">100%</div>
              <div className="text-muted-foreground font-medium text-xs md:text-base font-cairo">رضا العملاء</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;