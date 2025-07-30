import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PerformanceTester } from '@/components/testing/PerformanceTester';
import { LoadTestDashboard } from '@/components/testing/LoadTestDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  BarChart3, 
  Settings, 
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

const LoadTesting: React.FC = () => {
  const systemRequirements = [
    {
      requirement: 'زمن الاستجابة أقل من 2 ثانية',
      status: 'success' as const,
      current: '1.2 ثانية',
      target: '< 2 ثانية'
    },
    {
      requirement: 'دعم 100+ مستخدم متزامن',
      status: 'warning' as const,
      current: '80 مستخدم',
      target: '100 مستخدم'
    },
    {
      requirement: 'معدل أخطاء أقل من 1%',
      status: 'success' as const,
      current: '0.5%',
      target: '< 1%'
    },
    {
      requirement: 'استهلاك ذاكرة أقل من 80%',
      status: 'error' as const,
      current: '85%',
      target: '< 80%'
    },
    {
      requirement: 'إنتاجية أعلى من 10 req/sec',
      status: 'success' as const,
      current: '12.5 req/sec',
      target: '> 10 req/sec'
    }
  ];

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">اختبار الأداء والحمولة</h1>
              <p className="text-muted-foreground mt-2">
                نظام شامل لاختبار قدرة الموقع على تحمل 100+ طالب متزامن
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">الحالة العامة</div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-600">يحتاج تحسين</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* معلومات مهمة */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>هام:</strong> اختبارات الحمولة ستؤثر على أداء النظام أثناء التشغيل. 
            يُنصح بإجراء الاختبارات في بيئة منفصلة عن الإنتاج.
          </AlertDescription>
        </Alert>

        {/* متطلبات النظام */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              متطلبات الأداء المطلوبة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemRequirements.map((req, index) => (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg ${getStatusColor(req.status)}`}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(req.status)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-2">{req.requirement}</h4>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الحالي:</span>
                          <span className="font-medium">{req.current}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">المطلوب:</span>
                          <span className="font-medium">{req.target}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* التبويبات الرئيسية */}
        <Tabs defaultValue="tester" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tester" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              اختبار مباشر
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              لوحة المراقبة
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              دليل الاستخدام
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tester" className="space-y-6">
            <PerformanceTester />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <LoadTestDashboard />
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>دليل اختبار الأداء والحمولة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* مقدمة */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">ما هو اختبار الحمولة؟</h3>
                  <p className="text-muted-foreground mb-4">
                    اختبار الحمولة هو عملية محاكاة عدد كبير من المستخدمين المتزامنين لتقييم أداء النظام 
                    تحت ضغط الاستخدام المكثف وتحديد نقاط الضعف قبل إطلاق الموقع للجمهور.
                  </p>
                </div>

                {/* خطوات الاختبار */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">خطوات إجراء الاختبار</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">إعداد المتطلبات</h4>
                        <p className="text-sm text-muted-foreground">
                          حدد عدد المستخدمين المتزامنين ومدة الاختبار ونوع الاختبارات المطلوبة
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">تشغيل الاختبار</h4>
                        <p className="text-sm text-muted-foreground">
                          ابدأ الاختبار وراقب الأداء في الوقت الفعلي من خلال الرسوم البيانية
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">تحليل النتائج</h4>
                        <p className="text-sm text-muted-foreground">
                          راجع التقارير والتوصيات لتحديد نقاط التحسين المطلوبة
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* المقاييس المهمة */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">المقاييس المهمة</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded">
                      <h4 className="font-medium mb-2">زمن الاستجابة (Response Time)</h4>
                      <p className="text-sm text-muted-foreground">
                        الوقت اللازم للاستجابة لطلب المستخدم. يجب أن يكون أقل من 2 ثانية.
                      </p>
                    </div>
                    <div className="p-4 border rounded">
                      <h4 className="font-medium mb-2">الإنتاجية (Throughput)</h4>
                      <p className="text-sm text-muted-foreground">
                        عدد الطلبات المعالجة في الثانية الواحدة. هدفنا 10+ طلبات/ثانية.
                      </p>
                    </div>
                    <div className="p-4 border rounded">
                      <h4 className="font-medium mb-2">معدل الأخطاء (Error Rate)</h4>
                      <p className="text-sm text-muted-foreground">
                        نسبة الطلبات الفاشلة من إجمالي الطلبات. يجب أن تكون أقل من 1%.
                      </p>
                    </div>
                    <div className="p-4 border rounded">
                      <h4 className="font-medium mb-2">استخدام الموارد</h4>
                      <p className="text-sm text-muted-foreground">
                        استهلاك المعالج والذاكرة. يجب الحفاظ عليها تحت 80%.
                      </p>
                    </div>
                  </div>
                </div>

                {/* نصائح مهمة */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900">💡 نصائح مهمة</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• ابدأ بعدد قليل من المستخدمين وزد تدريجياً</li>
                    <li>• أجري الاختبارات في أوقات قليلة الاستخدام</li>
                    <li>• احفظ نتائج كل اختبار للمقارنة المستقبلية</li>
                    <li>• راقب سلوك النظام بعد انتهاء الاختبار</li>
                    <li>• اختبر سيناريوهات مختلفة (تسجيل دخول، مشاهدة فيديو، إلخ)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoadTesting;