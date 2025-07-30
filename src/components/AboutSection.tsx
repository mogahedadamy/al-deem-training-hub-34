import { CheckCircle, Trophy, Shield, Sparkles } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* كلمة المدير العام */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4 font-cairo">
              كلمة المدير العام
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-cairo mb-6">
              نحن في مركز العميد للتدريب المتقدم نسعى إلى تقديم أفضل الخدمات التدريبية للارتقاء بمستوى المتدربين وتطوير قدراتهم ومهاراتهم في مختلف المجالات.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed font-cairo mb-4">
              رؤيتنا تتمحور حول بناء جيل واعي قادر على مواجهة تحديات المستقبل من خلال برامج تدريبية متطورة ومعتمدة.
            </p>
            <div className="text-right">
              <p className="font-bold text-primary font-cairo">المدير العام</p>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" 
                alt="المدير العام" 
                className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-lg shadow-soft"
              />
            </div>
          </div>
        </div>

        {/* الخدمات */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4 font-cairo">
            الخدمات
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-cairo">
            نقدم مجموعة شاملة من الخدمات التدريبية المتخصصة
          </p>
        </div>

        {/* شبكة الخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white border border-border rounded-lg p-6 hover:shadow-soft transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2 font-cairo">البرامج التدريبية</h3>
              <p className="text-sm text-muted-foreground font-cairo">برامج تدريبية متنوعة في مختلف المجالات</p>
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 hover:shadow-soft transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2 font-cairo">الشهادات المعتمدة</h3>
              <p className="text-sm text-muted-foreground font-cairo">شهادات معترف بها محلياً وإقليمياً</p>
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 hover:shadow-soft transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-info" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2 font-cairo">المتابعة المستمرة</h3>
              <p className="text-sm text-muted-foreground font-cairo">دعم ومتابعة المتدربين بعد انتهاء الدورة</p>
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 hover:shadow-soft transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2 font-cairo">ورش العمل التطبيقية</h3>
              <p className="text-sm text-muted-foreground font-cairo">تطبيق عملي للمفاهيم النظرية</p>
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 hover:shadow-soft transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2 font-cairo">الاستشارات التخصصية</h3>
              <p className="text-sm text-muted-foreground font-cairo">استشارات مهنية في مختلف المجالات</p>
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 hover:shadow-soft transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-info" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2 font-cairo">برامج التطوير القيادي</h3>
              <p className="text-sm text-muted-foreground font-cairo">تنمية المهارات القيادية والإدارية</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;