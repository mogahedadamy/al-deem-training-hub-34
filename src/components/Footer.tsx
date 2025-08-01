import { Phone, Mail, BookOpen, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-primary/20 mt-4">
      {/* Top separator line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      <div className="container mx-auto px-4 py-6">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          
          {/* Logo and Center Info */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="text-lg font-bold text-foreground">مركز العميد للتدريب المتقدم</div>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              مركز تدريبي متخصص في التطوير المهني
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-8 md:space-x-reverse">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">+249 123 456 789</span>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">info@alameed-training.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-6 pt-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              كل الحقوق محفوظة © 2025 • تم التطوير بواسطة SudaPixel
            </p>
          </div>
          
          {/* Admin Access - Prominent Button */}
          <div className="fixed bottom-4 left-4 z-50">
            <Link 
              to="/admin/login" 
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/90 hover:bg-primary text-white shadow-lg hover:shadow-xl border-2 border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 group"
              title="دخول لوحة تحكم المدير"
            >
              <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;