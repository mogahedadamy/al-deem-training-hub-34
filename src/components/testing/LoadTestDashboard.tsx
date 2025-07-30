import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Server, 
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';

interface MetricData {
  timestamp: string;
  responseTime: number;
  throughput: number;
  errorRate: number;
  activeUsers: number;
  cpuUsage: number;
  memoryUsage: number;
}

interface LoadTestReport {
  testId: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxConcurrentUsers: number;
  totalRequests: number;
  successfulRequests: number;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  throughput: number;
  errorRate: number;
  status: 'passed' | 'failed' | 'warning';
}

export const LoadTestDashboard: React.FC = () => {
  const [metricsData, setMetricsData] = useState<MetricData[]>([]);
  const [reports, setReports] = useState<LoadTestReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<LoadTestReport | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // بيانات وهمية للعرض
  useEffect(() => {
    generateMockData();
  }, []);

  const generateMockData = () => {
    const mockMetrics: MetricData[] = [];
    const baseTime = Date.now() - 3600000; // ساعة واحدة مضت

    for (let i = 0; i < 60; i++) {
      const timestamp = new Date(baseTime + (i * 60000)).toISOString();
      mockMetrics.push({
        timestamp: timestamp.split('T')[1].slice(0, 5),
        responseTime: 200 + Math.random() * 800 + (i > 30 ? Math.random() * 500 : 0),
        throughput: 50 + Math.random() * 100 - (i > 40 ? Math.random() * 30 : 0),
        errorRate: Math.random() * 5 + (i > 45 ? Math.random() * 10 : 0),
        activeUsers: Math.min(100, i * 2 + Math.random() * 20),
        cpuUsage: 20 + Math.random() * 60 + (i > 35 ? Math.random() * 20 : 0),
        memoryUsage: 30 + Math.random() * 40 + (i * 0.5)
      });
    }

    setMetricsData(mockMetrics);

    // تقارير وهمية
    const mockReports: LoadTestReport[] = [
      {
        testId: 'test-001',
        startTime: '2024-01-15 14:30:00',
        endTime: '2024-01-15 15:30:00',
        duration: 3600,
        maxConcurrentUsers: 100,
        totalRequests: 45000,
        successfulRequests: 44100,
        averageResponseTime: 450,
        maxResponseTime: 2100,
        minResponseTime: 120,
        throughput: 12.5,
        errorRate: 2.0,
        status: 'passed'
      },
      {
        testId: 'test-002',
        startTime: '2024-01-15 16:00:00',
        endTime: '2024-01-15 17:00:00',
        duration: 3600,
        maxConcurrentUsers: 150,
        totalRequests: 52000,
        successfulRequests: 49400,
        averageResponseTime: 680,
        maxResponseTime: 5200,
        minResponseTime: 150,
        throughput: 13.7,
        errorRate: 5.0,
        status: 'warning'
      },
      {
        testId: 'test-003',
        startTime: '2024-01-15 18:00:00',
        endTime: '2024-01-15 19:00:00',
        duration: 3600,
        maxConcurrentUsers: 200,
        totalRequests: 48000,
        successfulRequests: 38400,
        averageResponseTime: 1200,
        maxResponseTime: 8500,
        minResponseTime: 200,
        throughput: 10.7,
        errorRate: 20.0,
        status: 'failed'
      }
    ];

    setReports(mockReports);
    setSelectedReport(mockReports[0]);
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    generateMockData();
    setIsRefreshing(false);
  };

  const exportReport = () => {
    if (!selectedReport) return;

    const reportData = {
      report: selectedReport,
      metrics: metricsData
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `load-test-report-${selectedReport.testId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'default';
      case 'warning': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <TrendingUp className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'failed': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة مراقبة اختبارات الحمولة</h1>
          <p className="text-muted-foreground">تقارير وتحليلات شاملة للأداء</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={refreshData} 
            variant="outline" 
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button 
            onClick={exportReport} 
            className="flex items-center gap-2"
            disabled={!selectedReport}
          >
            <Download className="w-4 h-4" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* ملخص الاختبارات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الاختبارات</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
              <Server className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">نجح</p>
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.status === 'passed').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تحذير</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reports.filter(r => r.status === 'warning').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">فشل</p>
                <p className="text-2xl font-bold text-red-600">
                  {reports.filter(r => r.status === 'failed').length}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">الرسوم البيانية</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
          <TabsTrigger value="analysis">التحليل المتقدم</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          {/* المقاييس المباشرة */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>زمن الاستجابة (مللي ثانية)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المستخدمون النشطون والإنتاجية</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={metricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="activeUsers" 
                      stackId="1"
                      stroke="#82ca9d" 
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="throughput" 
                      stackId="2"
                      stroke="#ffc658" 
                      fill="#ffc658"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>استخدام موارد النظام</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="cpuUsage" 
                      stroke="#ff7300" 
                      strokeWidth={2}
                      name="استخدام المعالج (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="memoryUsage" 
                      stroke="#413ea0" 
                      strokeWidth={2}
                      name="استخدام الذاكرة (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معدل الأخطاء</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="errorRate" fill="#ff6b6b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* قائمة التقارير */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>تقارير الاختبارات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {reports.map((report) => (
                  <div
                    key={report.testId}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedReport?.testId === report.testId 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{report.testId}</span>
                      <Badge variant={getStatusColor(report.status)}>
                        {getStatusIcon(report.status)}
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {report.maxConcurrentUsers} مستخدم - {report.errorRate}% أخطاء
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* تفاصيل التقرير المحدد */}
            {selectedReport && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    تقرير {selectedReport.testId}
                    <Badge variant={getStatusColor(selectedReport.status)}>
                      {getStatusIcon(selectedReport.status)}
                      {selectedReport.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* معلومات أساسية */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">وقت البداية</p>
                      <p className="font-medium">{selectedReport.startTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">وقت النهاية</p>
                      <p className="font-medium">{selectedReport.endTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">المدة</p>
                      <p className="font-medium">{selectedReport.duration} ثانية</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">أقصى مستخدمين</p>
                      <p className="font-medium">{selectedReport.maxConcurrentUsers}</p>
                    </div>
                  </div>

                  {/* إحصائيات الأداء */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedReport.successfulRequests.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">طلبات ناجحة</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded">
                      <p className="text-2xl font-bold">
                        {selectedReport.averageResponseTime}ms
                      </p>
                      <p className="text-sm text-muted-foreground">متوسط الاستجابة</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedReport.throughput}/s
                      </p>
                      <p className="text-sm text-muted-foreground">الإنتاجية</p>
                    </div>
                  </div>

                  {/* تفاصيل إضافية */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>إجمالي الطلبات:</span>
                      <span className="font-medium">{selectedReport.totalRequests.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>أسرع استجابة:</span>
                      <span className="font-medium">{selectedReport.minResponseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>أبطأ استجابة:</span>
                      <span className="font-medium">{selectedReport.maxResponseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>معدل الأخطاء:</span>
                      <span className={`font-medium ${
                        selectedReport.errorRate > 5 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {selectedReport.errorRate}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التحليل المتقدم والتوصيات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* تحليل الاتجاهات */}
              <div>
                <h3 className="text-lg font-semibold mb-3">تحليل الاتجاهات</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium">أداء ممتاز</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      النظام يتعامل بشكل جيد مع الحمولة المنخفضة (أقل من 50 مستخدم)
                    </p>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium">تحذير</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      تدهور في الأداء عند تجاوز 100 مستخدم متزامن
                    </p>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <span className="font-medium">نقطة فشل</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      فشل النظام مع أكثر من 150 مستخدم متزامن
                    </p>
                  </div>
                </div>
              </div>

              {/* التوصيات */}
              <div>
                <h3 className="text-lg font-semibold mb-3">التوصيات للتحسين</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                    <h4 className="font-medium text-blue-900 mb-2">🚀 تحسين البنية التحتية</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• إضافة load balancer لتوزيع الحمولة</li>
                      <li>• تحسين استعلامات قاعدة البيانات</li>
                      <li>• تفعيل التخزين المؤقت (caching)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    <h4 className="font-medium text-green-900 mb-2">💾 تحسين الذاكرة</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• تحسين إدارة الذاكرة في React</li>
                      <li>• تطبيق lazy loading للمكونات</li>
                      <li>• تحسين حجم الحزم (bundle size)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                    <h4 className="font-medium text-purple-900 mb-2">📹 تحسين الفيديو</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• تطبيق adaptive bitrate streaming</li>
                      <li>• استخدام CDN متخصص للفيديو</li>
                      <li>• تحسين compression settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};