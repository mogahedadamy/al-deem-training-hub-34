import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Sparkles, Star, Heart } from "lucide-react";
const ContactSection = () => {
  const contactInfo = [{
    icon: Phone,
    title: "رقم الهاتف",
    details: "+249 123 456 789",
    description: "متاح للمكالمات من 8 صباحاً إلى 5 مساءً",
    gradient: "from-primary to-secondary"
  }, {
    icon: Mail,
    title: "البريد الإلكتروني",
    details: "info@alameed-training.com",
    description: "سنرد عليك خلال 24 ساعة",
    gradient: "from-secondary to-primary"
  }, {
    icon: MapPin,
    title: "العنوان",
    details: "السودان - الخرطوم",
    description: "المقر الرئيسي - جامعة السودان - شارع الجيلة",
    gradient: "from-primary to-accent"
  }, {
    icon: Clock,
    title: "ساعات العمل",
    details: "السبت - الخميس",
    description: "8:00 ص - 5:00 م",
    gradient: "from-accent to-secondary"
  }];
  return <section id="contact" className="py-12 md:py-16 bg-gradient-to-br from-muted/20 to-background relative overflow-hidden border-b border-primary/10">
      {/* Section Separator */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-primary rounded-full animate-fade-in"></div>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-20 w-96 h-96 bg-gradient-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-12 pt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 rounded-full px-6 py-3 mb-6 animate-fade-in">
            <Heart className="w-6 h-6 text-primary drop-shadow-sm" />
            <span className="text-primary font-semibold">تواصل معنا</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6 animate-fade-in">
            نحن هنا لمساعدتك
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto animate-fade-in leading-relaxed" style={{
          animationDelay: "0.2s"
        }}>
            نحن هنا لمساعدتك في اختيار الدورة التدريبية المناسبة لك أو الإجابة على أي استفسارات
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Enhanced Contact Information */}
          <div className="space-y-8 animate-fade-in" style={{
          animationDelay: "0.3s"
        }}>
            <h3 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-8">معلومات التواصل</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-6">
              {contactInfo.slice(0, 3).map((info, index) => <Card key={index} className={`group border-0 shadow-card hover:shadow-elegant transition-all duration-500 hover:scale-105 bg-gradient-card ${index === 2 ? 'col-span-2 mx-auto max-w-sm md:col-span-1 md:max-w-none md:mx-0' : ''}`}>
                  <CardContent className="p-3 md:p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-right space-y-2 md:space-y-0 md:space-x-8">
                      <div className={`bg-gradient-to-r ${info.gradient} p-2 md:p-4 rounded-lg md:rounded-2xl shadow-hover group-hover:shadow-glow transition-all duration-300 flex-shrink-0`}>
                        <info.icon className="w-4 h-4 md:w-7 md:h-7 text-white drop-shadow-sm" />
                      </div>
                      <div>
                        <h4 className="text-sm md:text-xl font-bold text-secondary mb-1 md:mb-2 group-hover:text-primary transition-colors duration-300 font-cairo">{info.title}</h4>
                        <p className="text-xs md:text-2xl font-bold text-foreground mb-1 md:mb-2 font-cairo">{info.details}</p>
                        <p className="text-muted-foreground leading-relaxed text-xs md:text-base font-cairo">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
              {/* Working Hours Card - Centered on mobile */}
              <Card className="group border-0 shadow-card hover:shadow-elegant transition-all duration-500 hover:scale-105 bg-gradient-card col-span-2 mx-auto max-w-sm md:col-span-1 md:max-w-none md:mx-0">
                <CardContent className="p-3 md:p-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-right space-y-2 md:space-y-0 md:space-x-8">
                    <div className={`bg-gradient-to-r ${contactInfo[3].gradient} p-2 md:p-4 rounded-lg md:rounded-2xl shadow-hover group-hover:shadow-glow transition-all duration-300 flex-shrink-0`}>
                      <Clock className="w-4 h-4 md:w-7 md:h-7 text-white drop-shadow-sm" />
                    </div>
                    <div>
                      <h4 className="text-sm md:text-xl font-bold text-secondary mb-1 md:mb-2 group-hover:text-primary transition-colors duration-300 font-cairo">{contactInfo[3].title}</h4>
                      <p className="text-xs md:text-2xl font-bold text-foreground mb-1 md:mb-2 font-cairo">{contactInfo[3].details}</p>
                      <p className="text-muted-foreground leading-relaxed text-xs md:text-base font-cairo">{contactInfo[3].description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Social Links */}
            <div className="pt-8">
              <h4 className="text-base md:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 md:mb-6 font-cairo">تواصل معنا:</h4>
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-4">
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-hover hover:shadow-glow hover:scale-105 transition-all duration-300 px-3 md:px-6 py-2 md:py-3 text-xs md:text-base font-cairo"
                  onClick={() => window.open('https://wa.me/249123456789', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 md:w-6 md:h-6 ml-2 md:ml-3" />
                  واتساب
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 px-3 md:px-6 py-2 md:py-3 text-xs md:text-base font-cairo"
                  onClick={() => window.open('https://zoom.us/join', '_blank')}
                >
                  📹 زووم
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 md:px-6 md:py-3 text-xs md:text-base font-cairo mx-0 px-[12px] py-[8px]"
                  onClick={() => {
                    const teamSection = document.getElementById('team');
                    teamSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  💻 أونلاين
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Contact Form */}
          <Card className="border-0 shadow-elegant animate-fade-in bg-gradient-card" style={{
          animationDelay: "0.4s"
        }}>
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-primary p-3 rounded-2xl shadow-hover">
                  <Send className="w-7 h-7 text-white drop-shadow-sm" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">أرسل لنا رسالة</CardTitle>
                  <p className="text-muted-foreground">سنتواصل معك في أقرب وقت</p>
                </div>
              </div>
            </CardHeader>
            
          </Card>
        </div>
      </div>
    </section>;
};
export default ContactSection;