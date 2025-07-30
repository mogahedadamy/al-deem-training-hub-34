import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Users, Award, Star, Zap, TrendingUp } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16 md:-mt-20 border-b border-gradient-primary/20">
      {/* Background Image with Enhanced Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 right-10 md:left-10 animate-float opacity-60">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4 shadow-glow">
          <BookOpen className="w-7 h-7 md:w-9 md:h-9 text-primary drop-shadow-lg" />
        </div>
      </div>
      <div className="absolute top-40 left-16 md:right-16 animate-float opacity-60" style={{ animationDelay: "1s" }}>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-2 md:p-3 shadow-glow">
          <Users className="w-6 h-6 md:w-7 md:h-7 text-accent drop-shadow-lg" />
        </div>
      </div>
      <div className="absolute bottom-32 right-20 md:left-20 animate-float opacity-60" style={{ animationDelay: "2s" }}>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4 shadow-glow">
          <Award className="w-7 h-7 md:w-8 md:h-8 text-primary drop-shadow-lg" />
        </div>
      </div>
      <div className="absolute top-60 left-32 md:right-32 animate-float opacity-50" style={{ animationDelay: "0.5s" }}>
        <div className="bg-gradient-accent rounded-full p-2 md:p-3">
          <Star className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
      </div>
      <div className="absolute bottom-60 left-10 md:right-10 animate-float opacity-50" style={{ animationDelay: "1.5s" }}>
        <div className="bg-gradient-primary rounded-full p-2">
          <Zap className="w-3 h-3 md:w-4 md:h-4 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 text-center pt-16 md:pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 border border-white/20 mb-4 md:mb-6">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-primary drop-shadow-sm" />
              <span className="text-white font-medium text-sm md:text-base font-cairo">مركز التدريب الأول في السودان</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-6 md:mb-8 animate-fade-in leading-tight font-cairo">
            مركز <span className="bg-gradient-accent bg-clip-text text-transparent">العميد</span> للتدريب المتقدم
          </h1>
          
          <p className="text-lg md:text-2xl lg:text-3xl text-white/95 mb-8 md:mb-12 animate-fade-in font-light leading-relaxed font-cairo px-4" style={{ animationDelay: "0.2s" }}>
            نقدم دورات تدريبية متخصصة في التطوير الإداري والقيادي والتثقيفي مع فريق من الخبراء المعتمدين
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center animate-fade-in px-4" style={{ animationDelay: "0.4s" }}>
            <Button size="lg" className="w-full sm:w-auto text-lg md:text-xl px-8 md:px-10 py-3 md:py-4 bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 border-0 shadow-elegant font-cairo">
              <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 ml-3 md:ml-4" />
              استكشف دوراتنا
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg md:text-xl px-8 md:px-10 py-3 md:py-4 border-2 border-white/30 text-white hover:bg-white hover:text-secondary backdrop-blur-sm bg-white/10 transition-all duration-300 font-cairo">
              تواصل معنا
            </Button>
          </div>

          {/* Professional Stats Cards */}
          <div className="mt-16 md:mt-24 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              
              {/* Students Success Card */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl"></div>
                <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/30 hover:border-white/50 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl md:text-5xl font-bold text-white mb-1 font-cairo">500+</div>
                      <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full ml-auto"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-cairo">متدرب نجح معنا</h3>
                  <p className="text-white/80 text-sm font-cairo leading-relaxed">خريجون متميزون في مختلف المجالات التدريبية والمهنية</p>
                </div>
              </div>

              {/* Courses Card */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl"></div>
                <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/30 hover:border-white/50 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary to-info rounded-2xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl md:text-5xl font-bold text-white mb-1 font-cairo">50+</div>
                      <div className="w-12 h-1 bg-gradient-to-r from-secondary to-info rounded-full ml-auto"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-cairo">دورة تدريبية</h3>
                  <p className="text-white/80 text-sm font-cairo leading-relaxed">برامج تدريبية معتمدة ومتطورة في جميع التخصصات</p>
                </div>
              </div>

              {/* Experience Card */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl"></div>
                <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/30 hover:border-white/50 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-success to-accent rounded-2xl flex items-center justify-center shadow-lg">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl md:text-5xl font-bold text-white mb-1 font-cairo">5+</div>
                      <div className="w-12 h-1 bg-gradient-to-r from-success to-accent rounded-full ml-auto"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-cairo">سنوات خبرة</h3>
                  <p className="text-white/80 text-sm font-cairo leading-relaxed">خبرة عريقة في مجال التدريب والتطوير المهني</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;