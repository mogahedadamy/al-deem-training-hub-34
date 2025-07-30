import { Menu, X, Phone, User, LogIn, LogOut, BookOpen, Award, Settings, ChevronDown, Bell, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTestNotifications } from "@/hooks/useTestNotifications";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { state, logout } = useAuth();
  const { 
    getUserNotifications, 
    getUnreadCount, 
    markAsRead, 
    markAllAsRead, 
    archiveNotification, 
    deleteNotification 
  } = useNotifications();
  
  // Initialize test notifications
  useTestNotifications();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleNotificationClick = (notification: any) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  // Get user notifications
  const userNotifications = state.user ? getUserNotifications(state.user.id) : [];
  const unreadCount = state.user ? getUnreadCount(state.user.id) : 0;

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-border/50 shadow-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-4 hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-hover transform hover:scale-105 transition-all duration-300 border border-gray-200">
                <img 
                  src="/lovable-uploads/fb530070-f412-456e-a755-790d74e1bd9e.png" 
                  alt="شعار مركز العميد للتدريب" 
                  className="w-7 h-7 md:w-9 md:h-9 object-contain filter drop-shadow-sm"
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-base md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent font-cairo leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                مركز العميد للتدريب المتقدم
              </div>
              <div className="text-xs text-muted-foreground font-medium hidden md:block">Alameed Training Center</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 font-cairo">
            <Link to="/" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group text-lg">
              الرئيسية
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/#about" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group text-lg">
              عن المركز
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/#team" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group text-lg">
              فريق الخبراء
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/#training-plan" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group text-lg">
              الخطة التدريبية
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/#courses" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group text-lg">
              الدورات
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/#contact" className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group text-lg">
              اتصل بنا
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {state.isAuthenticated && state.user ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <NotificationDropdown
                  notifications={userNotifications}
                  unreadCount={unreadCount}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={() => state.user && markAllAsRead(state.user.id)}
                  onArchive={archiveNotification}
                  onDelete={deleteNotification}
                  onNotificationClick={handleNotificationClick}
                />

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-auto px-2 hover:bg-primary/10">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={state.user.avatar} alt={state.user.name} />
                          <AvatarFallback className="bg-primary text-white">
                            {state.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-right hidden md:block">
                          <p className="text-sm font-medium">{state.user.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {state.user.enrolledCourses.length} دورة
                          </Badge>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end">
                    <div className="flex items-center justify-start gap-2 p-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={state.user.avatar} alt={state.user.name} />
                        <AvatarFallback className="bg-primary text-white">
                          {state.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{state.user.name}</p>
                        <p className="w-[180px] truncate text-sm text-muted-foreground">
                          {state.user.email}
                        </p>
                        <div className="flex space-x-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {state.user.enrolledCourses.length} دورة
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {state.user.completedCourses.length} مكتملة
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      الملف الشخصي
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      دوراتي
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      تقدمي
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Award className="mr-2 h-4 w-4" />
                      شهاداتي
                      <Badge className="mr-auto text-xs">
                        {state.user.certificates.length}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      الإعدادات
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/auth-supabase')}
                  className="font-cairo hover:bg-primary/10"
                >
                  <LogIn className="w-4 h-4 ml-2" />
                  تسجيل الدخول
                </Button>
                <Button 
                  onClick={() => navigate('/auth-supabase')}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 font-cairo"
                  size="sm"
                >
                  إنشاء حساب
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-primary/10 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/50 animate-fade-in bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-elegant">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-primary transition-all duration-300 py-4 px-4 hover:bg-primary/5 rounded-lg font-medium text-lg font-cairo"
              >
                الرئيسية
              </Link>
              <Link 
                to="/#about" 
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-primary transition-all duration-300 py-4 px-4 hover:bg-primary/5 rounded-lg font-medium text-lg font-cairo"
              >
                عن المركز
              </Link>
              <Link 
                to="/#team" 
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-primary transition-all duration-300 py-4 px-4 hover:bg-primary/5 rounded-lg font-medium text-lg font-cairo"
              >
                فريق الخبراء
              </Link>
              <Link 
                to="/#training-plan" 
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-primary transition-all duration-300 py-4 px-4 hover:bg-primary/5 rounded-lg font-medium text-lg font-cairo"
              >
                الخطة التدريبية
              </Link>
              <Link 
                to="/#courses" 
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-primary transition-all duration-300 py-4 px-4 hover:bg-primary/5 rounded-lg font-medium text-lg font-cairo"
              >
                الدورات
              </Link>
              <Link 
                to="/#contact" 
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-primary transition-all duration-300 py-4 px-4 hover:bg-primary/5 rounded-lg font-medium text-lg font-cairo"
              >
                اتصل بنا
              </Link>
              
              {/* Mobile Auth/User Section */}
              <div className="mt-4 pt-4 border-t border-border/20">
                {state.isAuthenticated && state.user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={state.user.avatar} alt={state.user.name} />
                        <AvatarFallback className="bg-primary text-white">
                          {state.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{state.user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{state.user.email}</p>
                        <div className="flex space-x-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {state.user.enrolledCourses.length} دورة
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={() => handleNavigation('/profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      الملف الشخصي
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={() => handleNavigation('/dashboard')}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      دوراتي
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={() => handleNavigation('/dashboard')}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      تقدمي
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      تسجيل الخروج
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 font-cairo" 
                      onClick={() => handleNavigation('/auth-supabase')}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      تسجيل الدخول
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary/20 hover:border-primary font-cairo" 
                      onClick={() => handleNavigation('/auth-supabase')}
                    >
                      إنشاء حساب
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;