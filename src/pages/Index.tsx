import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CredentialsSection from "@/components/CredentialsSection";
import PartnershipsSection from "@/components/PartnershipsSection";
import TrainingPlanSection from "@/components/TrainingPlanSection";
import TeamSection from "@/components/TeamSection";
import CoursesSection from "@/components/CoursesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { CURRENCY } from "@/utils/currency";

const Index = () => {
  return <div className="min-h-screen pt-16 md:pt-20">
      <Header />
      
      {/* شريط إعلامي للعملة */}
      <div className="bg-gradient-subtle border-b border-primary/10">
        <div className="container mx-auto px-4 py-3">
          
        </div>
      </div>
      
      <HeroSection />
      <AboutSection />
      <CredentialsSection />
      <PartnershipsSection />
      <TeamSection />
      <TrainingPlanSection />
      <CoursesSection />
      <ContactSection />
      <Footer />
    </div>;
};

export default Index;