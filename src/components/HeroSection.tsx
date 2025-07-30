import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Users, Award, Star, Zap, TrendingUp } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-white -mt-16 md:-mt-20 border-b border-border">
      {/* Certificate image in top right */}
      <div className="absolute top-20 right-10 lg:right-20">
        <div className="bg-white rounded-lg shadow-soft p-4">
          <img src="/lovable-uploads/0b3967cc-2fe1-4e5d-bf68-28ca5fe57a34.png" alt="Certificate" className="w-32 md:w-48 lg:w-64 object-contain" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 text-center pt-16 md:pt-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 md:mb-6 animate-fade-in leading-tight font-cairo">
            كلمة المؤسس
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto mb-8 md:mb-12 animate-fade-in leading-relaxed font-cairo px-4" style={{ animationDelay: "0.2s" }}>
            نحن في مركز العميد للتدريب المتقدم، نؤمن بأن التطوير المستمر هو مفتاح النجاح. نسعى لتقديم أفضل البرامج التدريبية التي تساهم في بناء جيل قادر على مواجهة تحديات المستقبل
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center animate-fade-in px-4" style={{ animationDelay: "0.4s" }}>
            <Button size="lg" className="w-full sm:w-auto text-lg md:text-xl px-8 md:px-10 py-3 md:py-4 bg-accent hover:bg-accent/90 transition-all duration-300 text-white font-cairo">
              <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 ml-3 md:ml-4" />
              استكشف دوراتنا
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg md:text-xl px-8 md:px-10 py-3 md:py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-cairo">
              تواصل معنا
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;