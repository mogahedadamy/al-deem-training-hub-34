import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  User, 
  Menu, 
  X,
  GraduationCap,
  Phone,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const navigationItems = [
  {
    title: 'الرئيسية',
    href: '/',
    icon: Home
  },
  {
    title: 'الدورات',
    href: '/#courses',
    icon: BookOpen
  },
  {
    title: 'عن الفريق',
    href: '/#team',
    icon: Users
  },
  {
    title: 'التدريب',
    href: '/#training',
    icon: GraduationCap
  },
  {
    title: 'اتصل بنا',
    href: '/#contact',
    icon: Phone
  }
];

export const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { state } = useAuth();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        
        <SheetContent 
          side="right" 
          className="w-80 bg-background/95 backdrop-blur-lg border-l border-border/50"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h2 className="text-lg font-bold font-cairo text-foreground">
                القائمة
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-6">
              <div className="space-y-2 px-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href || 
                    (item.href.includes('#') && location.hash === item.href.split('#')[1]);
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={handleLinkClick}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-primary text-primary-foreground shadow-lg' 
                          : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-cairo font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* User Actions */}
            <div className="border-t border-border/50 p-4 space-y-3">
              {state.isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 w-full p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-cairo font-medium">لوحة التحكم</span>
                  </Link>
                  
                  <Link
                    to="/profile"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-cairo font-medium">الملف الشخصي</span>
                  </Link>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/auth"
                    onClick={handleLinkClick}
                    className="flex items-center justify-center w-full p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <span className="font-cairo font-medium">تسجيل الدخول</span>
                  </Link>
                  
                  <Link
                    to="/auth?mode=signup"
                    onClick={handleLinkClick}
                    className="flex items-center justify-center w-full p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-cairo font-medium">إنشاء حساب</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};