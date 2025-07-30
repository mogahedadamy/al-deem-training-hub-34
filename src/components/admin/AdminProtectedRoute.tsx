import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminLoggedIn = localStorage.getItem('admin_logged_in');
      const loginTime = localStorage.getItem('admin_login_time');
      
      if (!adminLoggedIn || adminLoggedIn !== 'true') {
        setIsAdminLoggedIn(false);
        return;
      }

      // التحقق من انتهاء صلاحية الجلسة (24 ساعة)
      if (loginTime) {
        const loginTimestamp = new Date(loginTime).getTime();
        const currentTime = new Date().getTime();
        const hoursDiff = (currentTime - loginTimestamp) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
          // انتهت صلاحية الجلسة
          localStorage.removeItem('admin_logged_in');
          localStorage.removeItem('admin_login_time');
          setIsAdminLoggedIn(false);
          return;
        }
      }

      setIsAdminLoggedIn(true);
    };

    checkAdminAuth();
  }, []);

  if (isAdminLoggedIn === null) {
    // حالة التحميل
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-cairo">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};