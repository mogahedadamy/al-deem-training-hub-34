import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleManager } from '@/components/admin/RoleManager';
import { CourseManager } from '@/components/admin/CourseManager';
import { LessonManager } from '@/components/admin/LessonManager';
import { PaymentManager } from '@/components/admin/PaymentManager';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, DollarSign, Settings, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { state, hasRole, signOut } = useAuth();
  const { getAllTransactions, getPendingTransactions } = usePayment();

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
              <div className="text-2xl font-bold">{getPendingTransactions().length}</div>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users" className="font-cairo">المستخدمين</TabsTrigger>
            <TabsTrigger value="courses" className="font-cairo">الدورات</TabsTrigger>
            <TabsTrigger value="lessons" className="font-cairo">الدروس</TabsTrigger>
            <TabsTrigger value="payments" className="font-cairo">المدفوعات</TabsTrigger>
            <TabsTrigger value="settings" className="font-cairo">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <RoleManager />
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <CourseManager />
          </TabsContent>

          <TabsContent value="lessons" className="mt-6">
            <LessonManager />
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <PaymentManager />
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