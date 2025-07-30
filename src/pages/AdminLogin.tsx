import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Admin credentials (في التطبيق الحقيقي يجب أن تكون مشفرة وفي قاعدة البيانات)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123!@#'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // محاكاة طلب مصادقة
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (
        credentials.username === ADMIN_CREDENTIALS.username &&
        credentials.password === ADMIN_CREDENTIALS.password
      ) {
        // حفظ حالة تسجيل الدخول
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_login_time', new Date().toISOString());
        
        toast.success('تم تسجيل الدخول بنجاح!');
        navigate('/admin/payments');
      } else {
        toast.error('بيانات الدخول غير صحيحة');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-card bg-gradient-card">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-secondary font-cairo">
              دخول المدير
            </CardTitle>
            <p className="text-muted-foreground font-cairo mt-2">
              الوصول إلى لوحة تحكم الإدارة
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-cairo">
                اسم المستخدم
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={credentials.username}
                onChange={(e) => setCredentials({
                  ...credentials,
                  username: e.target.value
                })}
                className="font-cairo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-cairo">
                كلمة المرور
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="أدخل كلمة المرور"
                  value={credentials.password}
                  onChange={(e) => setCredentials({
                    ...credentials,
                    password: e.target.value
                  })}
                  className="font-cairo pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 text-white border-0 shadow-hover font-cairo"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري التحقق...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  تسجيل الدخول
                </div>
              )}
            </Button>

            {/* معلومات بيانات الدخول للتطوير */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 font-cairo mb-2">
                بيانات الدخول (للتجربة):
              </h4>
              <div className="text-sm text-blue-700 font-mono space-y-1">
                <p><strong>اسم المستخدم:</strong> admin</p>
                <p><strong>كلمة المرور:</strong> admin123!@#</p>
              </div>
              <p className="text-xs text-blue-600 font-cairo mt-2">
                ⚠️ هذه بيانات تجريبية فقط للتطوير
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;