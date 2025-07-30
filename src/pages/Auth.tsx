import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, EyeOff, Mail, Lock, User, Phone, 
  ArrowRight, CheckCircle, Shield, Heart
} from "lucide-react";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-32 w-80 h-80 bg-gradient-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-32 w-96 h-96 bg-gradient-accent rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
          <ArrowRight className="w-5 h-5" />
          <span className="font-cairo font-medium">العودة للرئيسية</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-primary/10 rounded-full px-6 py-3 mb-4">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-primary font-bold text-lg font-cairo">معهد العلامة</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-cairo mb-2">
              مرحباً بك معنا
            </h1>
            <p className="text-muted-foreground font-cairo">
              ابدأ رحلة التعلم والتطوير المهني
            </p>
          </div>

          {/* Auth Forms */}
          <Card className="border-0 shadow-elegant bg-gradient-card">
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-cairo">
                {activeTab === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="font-cairo">تسجيل الدخول</TabsTrigger>
                  <TabsTrigger value="register" className="font-cairo">حساب جديد</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="font-cairo">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="أدخل بريدك الإلكتروني"
                        className="pl-10 font-cairo"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="font-cairo">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور"
                        className="pl-10 pr-10 font-cairo"
                        dir="ltr"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Link to="/forgot-password" className="text-primary hover:text-primary-dark transition-colors font-cairo">
                      نسيت كلمة المرور؟
                    </Link>
                  </div>

                  <Button className="w-full bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 text-white font-cairo">
                    <Shield className="w-4 h-4 ml-2" />
                    تسجيل الدخول
                  </Button>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="font-cairo">الاسم الكامل</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        className="pl-10 font-cairo"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="font-cairo">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="أدخل بريدك الإلكتروني"
                        className="pl-10 font-cairo"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="font-cairo">رقم الجوال</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="05xxxxxxxx"
                        className="pl-10 font-cairo"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="font-cairo">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور"
                        className="pl-10 pr-10 font-cairo"
                        dir="ltr"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="font-cairo">تأكيد كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="أعد إدخال كلمة المرور"
                        className="pl-10 pr-10 font-cairo"
                        dir="ltr"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground font-cairo">
                    بإنشاء حساب، أنت توافق على{" "}
                    <Link to="/terms" className="text-primary hover:text-primary-dark">
                      الشروط والأحكام
                    </Link>{" "}
                    و{" "}
                    <Link to="/privacy" className="text-primary hover:text-primary-dark">
                      سياسة الخصوصية
                    </Link>
                  </div>

                  <Button className="w-full bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 text-white font-cairo">
                    <CheckCircle className="w-4 h-4 ml-2" />
                    إنشاء الحساب
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center text-sm text-muted-foreground font-cairo">
                  هل تحتاج مساعدة؟{" "}
                  <Link to="/contact" className="text-primary hover:text-primary-dark transition-colors">
                    تواصل معنا
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;