import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, BookOpen, Shield } from 'lucide-react';

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const { login, register, state } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(formData.email, formData.password);
    if (success) {
      navigate(from, { replace: true });
    }

    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone
    });

    if (success) {
      navigate(from, { replace: true });
    }

    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-elegant group-hover:shadow-glow transition-all duration-300">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent font-cairo">
                مركز العميد
              </h1>
              <p className="text-sm text-muted-foreground font-cairo">للتدريب والتطوير</p>
            </div>
          </Link>

          <Badge variant="secondary" className="hidden md:flex items-center space-x-2 px-4 py-2">
            <Shield className="w-4 h-4" />
            <span className="font-cairo">منصة آمنة ومعتمدة</span>
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6 relative z-10">
          {/* Welcome Card */}
          <Card className="text-center border-0 shadow-card bg-gradient-card">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-elegant">
                <User className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold font-cairo">
                أهلاً وسهلاً بك
              </CardTitle>
              <CardDescription className="text-base font-cairo">
                ابدأ رحلتك التعليمية معنا اليوم
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Auth Tabs */}
          <Card className="border-0 shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="font-cairo">تسجيل الدخول</TabsTrigger>
                  <TabsTrigger value="register" className="font-cairo">إنشاء حساب</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login" className="space-y-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="font-cairo">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="أدخل بريدك الإلكتروني"
                          className="pl-4 pr-10 font-cairo"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="font-cairo">كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="أدخل كلمة المرور"
                          className="pl-10 pr-10 font-cairo"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {state.error && (
                      <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg font-cairo">
                        {state.error}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 font-cairo"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>جاري تسجيل الدخول...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>تسجيل الدخول</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>

                    <div className="text-center">
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-primary hover:underline font-cairo"
                      >
                        نسيت كلمة المرور؟
                      </Link>
                    </div>
                  </form>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register" className="space-y-6">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="font-cairo">الاسم الكامل</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                          className="pl-4 pr-10 font-cairo"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="font-cairo">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="أدخل بريدك الإلكتروني"
                          className="pl-4 pr-10 font-cairo"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-phone" className="font-cairo">رقم الهاتف (اختياري)</Label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="أدخل رقم هاتفك"
                          className="pl-4 pr-10 font-cairo"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="font-cairo">كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="أدخل كلمة المرور"
                          className="pl-10 pr-10 font-cairo"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {state.error && (
                      <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg font-cairo">
                        {state.error}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 font-cairo"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>جاري إنشاء الحساب...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>إنشاء حساب</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>

                    <div className="text-xs text-center text-muted-foreground font-cairo">
                      بإنشاء حساب، أنت توافق على{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        شروط الاستخدام
                      </Link>{' '}
                      و{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        سياسة الخصوصية
                      </Link>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Demo Info */}
          <Card className="border-0 shadow-card bg-gradient-card">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground font-cairo mb-2">
                للتجربة السريعة:
              </p>
              <div className="text-xs space-y-1 font-cairo">
                <p><strong>البريد:</strong> ahmed@example.com</p>
                <p><strong>كلمة المرور:</strong> 123456</p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Support */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-cairo">
              تحتاج مساعدة؟{' '}
              <Link to="/contact" className="text-primary hover:underline">
                تواصل معنا
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}