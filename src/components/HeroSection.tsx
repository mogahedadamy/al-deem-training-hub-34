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
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
      </div>
      
      {/* Enhanced Floating Elements - More spread out on desktop */}
      <div className="absolute top-20 right-10 lg:top-24 lg:left-24 animate-float opacity-70">
        <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-3 md:p-6 lg:p-8 shadow-2xl border border-white/40">
          <BookOpen className="w-7 h-7 md:w-9 md:h-9 lg:w-12 lg:h-12 text-primary drop-shadow-lg" />
        </div>
      </div>
      <div className="absolute top-40 left-16 lg:top-32 lg:right-32 animate-float opacity-70" style={{ animationDelay: "1s" }}>
        <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-2 md:p-3 lg:p-6 shadow-2xl border border-white/40">
          <Users className="w-6 h-6 md:w-7 md:h-7 lg:w-10 lg:h-10 text-accent drop-shadow-lg" />
        </div>
      </div>
      <div className="absolute bottom-32 right-20 lg:bottom-40 lg:left-40 animate-float opacity-70" style={{ animationDelay: "2s" }}>
        <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-3 md:p-4 lg:p-7 shadow-2xl border border-white/40">
          <Award className="w-7 h-7 md:w-8 md:h-8 lg:w-11 lg:h-11 text-primary drop-shadow-lg" />
        </div>
      </div>
      <div className="absolute top-60 left-32 lg:top-80 lg:right-20 animate-float opacity-60" style={{ animationDelay: "0.5s" }}>
        <div className="bg-gradient-accent rounded-full p-2 md:p-3 lg:p-5 shadow-xl">
          <Star className="w-4 h-4 md:w-5 md:h-5 lg:w-7 lg:h-7 text-white" />
        </div>
      </div>
      <div className="absolute bottom-60 left-10 lg:bottom-80 lg:right-60 animate-float opacity-60" style={{ animationDelay: "1.5s" }}>
        <div className="bg-gradient-primary rounded-full p-2 lg:p-4 shadow-xl">
          <Zap className="w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 text-center pt-16 md:pt-20 lg:pt-32">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8 lg:mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 lg:gap-4 bg-white/15 backdrop-blur-lg rounded-full px-4 md:px-6 lg:px-10 py-2 md:py-3 lg:py-5 border border-white/30 mb-4 md:mb-6 lg:mb-10 shadow-2xl">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-primary drop-shadow-sm" />
              <span className="text-white font-medium text-sm md:text-base lg:text-xl font-cairo">المركز الإلكترونى الأول فى السودان</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-8xl xl:text-9xl font-bold text-white mb-6 md:mb-8 lg:mb-8 animate-fade-in leading-tight font-cairo drop-shadow-2xl" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)" }}>
            مركز <span className="bg-gradient-accent bg-clip-text text-transparent drop-shadow-2xl" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>العميد</span> للتدريب المتقدم
          </h1>
          
          <p className="text-lg md:text-2xl lg:text-4xl xl:text-5xl text-white mb-8 md:mb-12 lg:mb-12 animate-fade-in font-light leading-relaxed font-cairo px-4 lg:px-8 max-w-5xl mx-auto drop-shadow-lg" style={{ animationDelay: "0.2s", textShadow: "1px 1px 3px rgba(0,0,0,0.8)" }}>
            نقدم دورات تدريبية متخصصة في التطوير الإداري والقيادي والتثقيفي مع فريق من الخبراء المعتمدين
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 lg:gap-8 justify-center items-center animate-fade-in px-4 lg:px-8" style={{ animationDelay: "0.4s" }}>
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-lg md:text-xl lg:text-2xl px-8 md:px-10 lg:px-16 py-3 md:py-4 lg:py-6 bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 border-0 shadow-elegant font-cairo rounded-2xl"
              onClick={() => {
                const coursesSection = document.getElementById('courses');
                coursesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 ml-3 md:ml-4 lg:ml-6" />
              استكشف دوراتنا
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-lg md:text-xl lg:text-2xl px-8 md:px-10 lg:px-16 py-3 md:py-4 lg:py-6 border-2 border-white/40 text-white hover:bg-white hover:text-secondary backdrop-blur-lg bg-white/15 transition-all duration-300 font-cairo rounded-2xl shadow-xl"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              تواصل معنا
            </Button>
          </div>

          {/* Professional Stats Cards - Improved spacing and size for desktop */}
          <div className="mt-16 md:mt-24 lg:mt-32 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 max-w-5xl lg:max-w-7xl mx-auto">
              
              {/* Students Success Card */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-3xl lg:rounded-[2.5rem]"></div>
                <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl lg:rounded-[2.5rem] p-8 lg:p-12 border border-white/40 hover:border-white/60 transition-all duration-500 hover:transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-white/30 hover:bg-white/25">
                  <div className="flex items-center justify-between mb-6 lg:mb-10">
                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-primary to-accent rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl">
                      <Users className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-1 font-cairo">26000</div>
                      <div className="w-12 h-1 lg:w-20 lg:h-2 bg-gradient-to-r from-primary to-accent rounded-full ml-auto"></div>
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-3xl font-bold text-white mb-2 lg:mb-4 font-cairo">متدرب تخرجوا من المركز</h3>
                  <p className="text-white/80 text-sm lg:text-lg font-cairo leading-relaxed">خريجون متميزون في مختلف المجالات التدريبية والمهنية</p>
                </div>
              </div>

              {/* Courses Card */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-3xl lg:rounded-[2.5rem]"></div>
                <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl lg:rounded-[2.5rem] p-8 lg:p-12 border border-white/40 hover:border-white/60 transition-all duration-500 hover:transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-white/30 hover:bg-white/25">
                  <div className="flex items-center justify-between mb-6 lg:mb-10">
                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-secondary to-info rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl">
                      <BookOpen className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-1 font-cairo">120+</div>
                      <div className="w-12 h-1 lg:w-20 lg:h-2 bg-gradient-to-r from-secondary to-info rounded-full ml-auto"></div>
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-3xl font-bold text-white mb-2 lg:mb-4 font-cairo">دورة تدريبية</h3>
                  <p className="text-white/80 text-sm lg:text-lg font-cairo leading-relaxed">أكثر من ١٢٠ دورة تدريبية في مختلف الدورات</p>
                </div>
              </div>

              {/* Experience Card */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-3xl lg:rounded-[2.5rem]"></div>
                <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl lg:rounded-[2.5rem] p-8 lg:p-12 border border-white/40 hover:border-white/60 transition-all duration-500 hover:transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-white/30 hover:bg-white/25">
                  <div className="flex items-center justify-between mb-6 lg:mb-10">
                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-success to-accent rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl">
                      <Award className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-1 font-cairo">10</div>
                      <div className="w-12 h-1 lg:w-20 lg:h-2 bg-gradient-to-r from-success to-accent rounded-full ml-auto"></div>
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-3xl font-bold text-white mb-2 lg:mb-4 font-cairo">سنوات خبرة</h3>
                  <p className="text-white/80 text-sm lg:text-lg font-cairo leading-relaxed">خبرة عريقة في مجال التدريب والتطوير المهني</p>
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