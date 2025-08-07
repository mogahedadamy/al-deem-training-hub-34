import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, Star, Handshake } from "lucide-react";

const PartnershipsSection = () => {
  const partnerships = [
    {
      name: "جامعة السودان للعلوم والتكنولوجيا",
      description: "شراكة أكاديمية لمنح شهادات معتمدة في التخصصات التقنية والإدارية",
      logo: "/lovable-uploads/257fe81b-b1c8-4137-9f97-5e677f2a40e5.png",
      type: "شراكة أكاديمية",
      specialization: "الشهادات الجامعية المعتمدة",
      icon: Star
    },
    {
      name: "الأكاديمية الدولية البريطانية",
      nameEn: "British International Academy (BIA)",
      description: "شراكة دولية لتقديم برامج تدريبية معتمدة عالمياً حسب المعايير البريطانية",
      logo: "/lovable-uploads/3a5244ff-4a06-4f72-a7bd-d9fae2db76ff.png",
      type: "شراكة دولية",
      specialization: "المعايير البريطانية للتدريب",
      icon: Globe
    },
    {
      name: "مركز الابتكار - ماليزيا",
      nameEn: "Global Innovation Training Centre (GITC)",
      description: "شراكة تقنية متقدمة في مجال الابتكار والتكنولوجيا الحديثة",
      logo: "/lovable-uploads/4207f6d3-9c28-4963-b52d-72ca1e8e92e5.png",
      type: "شراكة تقنية",
      specialization: "التقنيات المتقدمة والابتكار",
      icon: Users
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            <Handshake className="w-4 h-4 mr-2" />
            الشراكات الذكية
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6">
            شراكاتنا الاستراتيجية
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نفخر بشراكاتنا مع أفضل المؤسسات التعليمية والأكاديمية محلياً وعالمياً لضمان أعلى معايير الجودة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {partnerships.map((partner, index) => {
            const IconComponent = partner.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-3 bg-card border-primary/10 overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 mx-auto bg-background rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="mb-3">
                      {partner.type}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {partner.name}
                      </h3>
                      {partner.nameEn && (
                        <p className="text-sm text-muted-foreground font-medium mb-3">
                          {partner.nameEn}
                        </p>
                      )}
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {partner.description}
                    </p>

                    <div className="pt-4 border-t border-primary/10">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium text-foreground">
                          {partner.specialization}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            شراكاتنا تضمن حصولك على أفضل تجربة تدريبية بمعايير عالمية ومحلية معتمدة
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnershipsSection;