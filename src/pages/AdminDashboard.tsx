import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleManager } from '@/components/admin/RoleManager';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, DollarSign, Settings, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { state, hasRole, signOut } = useAuth();

  if (!state.isAuthenticated || !hasRole('admin')) {
    return <Navigate to="/auth-supabase" replace />;
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-cairo">لوحة تحكم المشرف</h1>
            <p className="text-muted-foreground font-cairo">إدارة النظام والمستخدمين</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold font-cairo">{state.user?.profile?.full_name}</p>
              <p className="text-sm text-muted-foreground">{state.user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="font-cairo">
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-cairo">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground font-cairo">مستخدم مسجل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-cairo">الدورات المنشورة</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground font-cairo">دورة متاحة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-cairo">المدفوعات المعلقة</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground font-cairo">معاملة في الانتظار</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-cairo">حالة النظام</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">نشط</div>
              <p className="text-xs text-muted-foreground font-cairo">جميع الخدمات تعمل</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="font-cairo">إدارة المستخدمين</TabsTrigger>
            <TabsTrigger value="courses" className="font-cairo">إدارة الدورات</TabsTrigger>
            <TabsTrigger value="payments" className="font-cairo">إدارة المدفوعات</TabsTrigger>
            <TabsTrigger value="settings" className="font-cairo">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <RoleManager />
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-cairo">إدارة الدورات</CardTitle>
                <CardDescription className="font-cairo">
                  إضافة وتعديل وحذف الدورات التدريبية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-cairo">قريباً...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-cairo">إدارة المدفوعات</CardTitle>
                <CardDescription className="font-cairo">
                  مراجعة وتأكيد المدفوعات المرسلة من الطلاب
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-cairo">قريباً...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-cairo">إعدادات النظام</CardTitle>
                <CardDescription className="font-cairo">
                  تكوين الإعدادات العامة للنظام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-cairo">قريباً...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}