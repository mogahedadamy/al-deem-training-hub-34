import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, FileCheck, BookOpen } from "lucide-react";

const CredentialsSection = () => {
  const credentials = [
    {
      title: "شهادة تسجيل المركز",
      description: "شهادة تسجيل المركز من وزارة العدل السودانية",
      image: "/lovable-uploads/27ff9d8c-aec1-4929-bfbd-0eb91e019d0b.png",
      icon: Shield,
      type: "تسجيل رسمي"
    },
    {
      title: "ترخيص مركز التدريب",
      description: "ترخيص مزاولة المهنة من وزارة التنمية البشرية",
      image: "/lovable-uploads/da0ab7ad-1035-4264-b39f-4012a97710cc.png",
      icon: FileCheck,
      type: "ترخيص معتمد"
    },
    {
      title: "نموذج شهادة الدورات",
      description: "شهادات معتمدة لجميع دوراتنا التدريبية",
      image: "/lovable-uploads/09553343-1d9f-41d5-aa42-ae39ff9081a4.png",
      icon: Award,
      type: "شهادة معتمدة"
    },
    {
      title: "شهادة جامعية معتمدة",
      description: "شراكة مع جامعة السودان للعلوم والتكنولوجيا",
      image: "/lovable-uploads/1cdf74f1-aa87-49db-968b-5ac342097e39.png",
      icon: BookOpen,
      type: "اعتماد أكاديمي"
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            المصداقية والاعتماد
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6">
            تراخيص وشهادات المركز
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            مركز العميد للتدريب معتمد رسمياً ومرخص من الجهات المختصة لضمان جودة التدريب وصحة الشهادات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {credentials.map((credential, index) => {
            const IconComponent = credential.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-card border-primary/10"
              >
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                        {credential.type}
                      </Badge>
                    </div>
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
                      <img
                        src={credential.image}
                        alt={credential.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {credential.title}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {credential.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            جميع الشهادات والتراخيص صالحة ومعتمدة من الجهات الرسمية المختصة
          </p>
        </div>
      </div>
    </section>
  );
};

export default CredentialsSection;