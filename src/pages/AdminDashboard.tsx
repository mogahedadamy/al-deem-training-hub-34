import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleManager } from '@/components/admin/RoleManager';
import { CourseManager } from '@/components/admin/CourseManager';
import { LessonManager } from '@/components/admin/LessonManager';
import PriceManager from '@/components/admin/PriceManager';
import { PaymentManager } from '@/components/admin/PaymentManager';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, DollarSign, Settings, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalUsers: number;
  publishedCourses: number;
  pendingPayments: number;
  totalLessons: number;
}

export default function AdminDashboard() {
  const { state, hasRole, signOut } = useAuth();
  const { getAllTransactions, getPendingTransactions } = usePayment();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    publishedCourses: 0,
    pendingPayments: 0,
    totalLessons: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.isAuthenticated && hasRole('admin')) {
      fetchDashboardStats();
    }
  }, [state.isAuthenticated, hasRole]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // جلب عدد المستخدمين
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // جلب عدد الدورات المنشورة  
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // جلب عدد المدفوعات المعلقة
      const { count: paymentsCount } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // جلب عدد الدروس
      const { count: lessonsCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: usersCount || 0,
        publishedCourses: coursesCount || 0,
        pendingPayments: paymentsCount || 0,
        totalLessons: lessonsCount || 0
      });

    } catch (error: any) {
      console.error('خطأ في جلب إحصائيات لوحة المدير:', error);
      toast({
        title: "خطأ في تحميل الإحصائيات",
        description: "حدث خطأ أثناء تحميل بيانات لوحة المدير",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // إعداد التحديث الفوري للبيانات
  useEffect(() => {
    if (!state.isAuthenticated || !hasRole('admin')) return;

    // الاستماع للتغييرات في جدول المستخدمين
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, () => {
        fetchDashboardStats();
      })
      .subscribe();

    // الاستماع للتغييرات في جدول الدورات
    const coursesChannel = supabase
      .channel('courses-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'courses'
      }, () => {
        fetchDashboardStats();
      })
      .subscribe();

    // الاستماع للتغييرات في جدول المدفوعات
    const paymentsChannel = supabase
      .channel('payments-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'payments'
      }, () => {
        fetchDashboardStats();
      })
      .subscribe();

    // الاستماع للتغييرات في جدول الدروس
    const lessonsChannel = supabase
      .channel('lessons-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'lessons'
      }, () => {
        fetchDashboardStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(coursesChannel);
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(lessonsChannel);
    };
  }, [state.isAuthenticated, hasRole]);

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
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" />
                ) : (
                  stats.totalUsers
                )}
              </div>
              <p className="text-xs text-muted-foreground font-cairo">مستخدم مسجل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-cairo">الدورات المنشورة</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" />
                ) : (
                  stats.publishedCourses
                )}
              </div>
              <p className="text-xs text-muted-foreground font-cairo">دورة متاحة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-cairo">المدفوعات المعلقة</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" />
                ) : (
                  stats.pendingPayments
                )}
              </div>
              <p className="text-xs text-muted-foreground font-cairo">معاملة في الانتظار</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-cairo">إجمالي الدروس</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" />
                ) : (
                  stats.totalLessons
                )}
              </div>
              <p className="text-xs text-muted-foreground font-cairo">درس متاح</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users" className="font-cairo">المستخدمين</TabsTrigger>
            <TabsTrigger value="courses" className="font-cairo">الدورات</TabsTrigger>
            <TabsTrigger value="lessons" className="font-cairo">الدروس</TabsTrigger>
            <TabsTrigger value="prices" className="font-cairo">الأسعار</TabsTrigger>
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

          <TabsContent value="prices" className="mt-6">
            <PriceManager />
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