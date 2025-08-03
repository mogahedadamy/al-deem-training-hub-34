import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, Search, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cn } from '@/lib/utils';

const bottomNavItems = [
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
    title: 'البحث',
    href: '/search',
    icon: Search
  },
  {
    title: 'الحساب',
    href: '/dashboard',
    icon: User,
    requireAuth: true
  }
];

export const BottomNavigation = () => {
  const location = useLocation();
  const { state } = useAuth();

  // إخفاء في صفحات معينة
  const hideOnRoutes = ['/auth', '/admin'];
  const shouldHide = hideOnRoutes.some(route => location.pathname.startsWith(route));

  if (shouldHide) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border/50 z-50">
      <nav className="flex items-center justify-around px-2 py-2">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          
          // تخطي العناصر التي تتطلب تسجيل دخول
          if (item.requireAuth && !state.isAuthenticated) {
            return (
              <Link
                key="auth"
                to="/auth"
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50 transition-colors min-w-0 flex-1"
              >
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-cairo text-muted-foreground">تسجيل</span>
              </Link>
            );
          }
          
          const isActive = location.pathname === item.href || 
            (item.href.includes('#') && location.hash === item.href.split('#')[1]);
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-cairo truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};