import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SignInFormData {
  email: string;
  password: string;
}

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function AuthSupabase() {
  const { state, signIn, signUp, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [signInData, setSignInData] = useState<SignInFormData>({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!signInData.email || !signInData.password) {
      return;
    }

    await signIn(signInData.email, signInData.password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!signUpData.fullName || !signUpData.email || !signUpData.password) {
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      return;
    }

    if (signUpData.password.length < 6) {
      return;
    }

    await signUp(signUpData.email, signUpData.password, signUpData.fullName);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-10 h-10 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-cairo">أكاديمية التدريب الإلكتروني</h1>
          </div>
          <p className="text-muted-foreground font-cairo">المركز الإلكتروني الأول في السودان</p>
        </div>

        <Card className="border border-border/50 shadow-elegant">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-cairo text-xl">مرحباً بك</CardTitle>
            <CardDescription className="font-cairo">
              سجل دخولك أو أنشئ حساب جديد للبدء
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {state.error && (
              <Alert className="mb-6 border-destructive/50 bg-destructive/10">
                <AlertDescription className="text-destructive font-cairo">
                  {state.error}
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" className="font-cairo">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup" className="font-cairo">إنشاء حساب</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="font-cairo">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="أدخل بريدك الإلكتروني"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className="pr-10 font-cairo"
                        required
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="font-cairo">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className="pr-10 pl-10 font-cairo"
                        required
                        dir="ltr"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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

                  <Button 
                    type="submit" 
                    className="w-full font-cairo"
                    disabled={state.isLoading}
                  >
                    {state.isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="font-cairo">الاسم الكامل</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                        className="pr-10 font-cairo"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="font-cairo">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="أدخل بريدك الإلكتروني"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        className="pr-10 font-cairo"
                        required
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="font-cairo">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className="pr-10 pl-10 font-cairo"
                        required
                        minLength={6}
                        dir="ltr"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                    <Label htmlFor="signup-confirm-password" className="font-cairo">تأكيد كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="أعد إدخال كلمة المرور"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        className="pr-10 pl-10 font-cairo"
                        required
                        dir="ltr"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {signUpData.password && signUpData.confirmPassword && signUpData.password !== signUpData.confirmPassword && (
                      <p className="text-sm text-destructive font-cairo">كلمات المرور غير متطابقة</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full font-cairo"
                    disabled={state.isLoading || signUpData.password !== signUpData.confirmPassword}
                  >
                    {state.isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-cairo"
              >
                العودة إلى الصفحة الرئيسية
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}