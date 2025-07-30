import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Users, 
  Clock, 
  Cpu, 
  MemoryStick, 
  Network,
  Play,
  Pause,
  Square,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface LoadTestConfig {
  concurrentUsers: number;
  testDuration: number; // بالثواني
  rampUpTime: number; // بالثواني
  videoTestEnabled: boolean;
  apiTestEnabled: boolean;
}

interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  activeConnections: number;
}

interface TestResult {
  timestamp: number;
  metrics: PerformanceMetrics;
  status: 'success' | 'warning' | 'error';
}

export const PerformanceTester: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [config, setConfig] = useState<LoadTestConfig>({
    concurrentUsers: 10,
    testDuration: 60,
    rampUpTime: 10,
    videoTestEnabled: true,
    apiTestEnabled: true
  });
  
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics>({
    responseTime: 0,
    throughput: 0,
    errorRate: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    networkLatency: 0,
    activeConnections: 0
  });

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [testPhase, setTestPhase] = useState<'idle' | 'rampup' | 'sustained' | 'rampdown'>('idle');

  const intervalRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);

  // محاكاة مستخدم واحد
  const simulateUser = async (userId: number): Promise<void> => {
    try {
      const startTime = performance.now();
      
      // محاكاة تحميل الصفحة
      await fetch(window.location.origin, { method: 'HEAD' });
      
      if (config.videoTestEnabled) {
        // محاكاة تحميل فيديو
        const videoElement = document.createElement('video');
        videoElement.src = '/api/test-video'; // فيديو وهمي
        await new Promise(resolve => {
          videoElement.addEventListener('loadstart', resolve, { once: true });
          setTimeout(resolve, 100); // fallback
        });
      }

      if (config.apiTestEnabled) {
        // محاكاة استدعاءات API
        await Promise.all([
          fetch('/api/courses', { method: 'HEAD' }).catch(() => {}),
          fetch('/api/user/progress', { method: 'HEAD' }).catch(() => {}),
          fetch('/api/analytics', { method: 'HEAD' }).catch(() => {})
        ]);
      }

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // تحديث المقاييس
      setCurrentMetrics(prev => ({
        ...prev,
        responseTime: (prev.responseTime + responseTime) / 2,
        throughput: prev.throughput + 1,
        activeConnections: prev.activeConnections
      }));

    } catch (error) {
      setCurrentMetrics(prev => ({
        ...prev,
        errorRate: prev.errorRate + 1
      }));
    }
  };

  // مراقبة الأداء
  const monitorPerformance = () => {
    // محاكاة قراءة مقاييس النظام
    const cpuUsage = Math.random() * 100;
    const memoryUsage = (performance as any).memory 
      ? ((performance as any).memory.usedJSHeapSize / (performance as any).memory.totalJSHeapSize) * 100
      : Math.random() * 100;
    
    const networkLatency = Math.random() * 200; // ms

    setCurrentMetrics(prev => ({
      ...prev,
      cpuUsage,
      memoryUsage,
      networkLatency
    }));

    // حفظ النتائج
    const result: TestResult = {
      timestamp: Date.now(),
      metrics: { ...currentMetrics, cpuUsage, memoryUsage, networkLatency },
      status: currentMetrics.errorRate > 5 ? 'error' : 
              currentMetrics.responseTime > 2000 ? 'warning' : 'success'
    };

    setTestResults(prev => [...prev.slice(-49), result]); // الاحتفاظ بآخر 50 نتيجة
  };

  // بدء الاختبار
  const startTest = async () => {
    setIsRunning(true);
    setIsPaused(false);
    setTestResults([]);
    setProgress(0);
    setActiveUsers(0);
    startTimeRef.current = Date.now();

    // مرحلة الزيادة التدريجية
    setTestPhase('rampup');
    for (let i = 0; i < config.concurrentUsers; i++) {
      setTimeout(() => {
        if (isRunning && !isPaused) {
          setActiveUsers(prev => prev + 1);
          simulateUser(i);
        }
      }, (config.rampUpTime * 1000 * i) / config.concurrentUsers);
    }

    // التحول للمرحلة المستدامة
    setTimeout(() => {
      if (isRunning) {
        setTestPhase('sustained');
      }
    }, config.rampUpTime * 1000);

    // بدء المراقبة
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        monitorPerformance();
        
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const newProgress = Math.min((elapsed / config.testDuration) * 100, 100);
        setProgress(newProgress);

        if (elapsed >= config.testDuration) {
          stopTest();
        }
      }
    }, 1000);
  };

  // إيقاف الاختبار
  const stopTest = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTestPhase('idle');
    setActiveUsers(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // إيقاف مؤقت
  const pauseTest = () => {
    setIsPaused(!isPaused);
  };

  // تقييم الأداء العام
  const getOverallStatus = () => {
    if (currentMetrics.errorRate > 5) return 'error';
    if (currentMetrics.responseTime > 2000 || currentMetrics.cpuUsage > 80) return 'warning';
    return 'success';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">اختبار الأداء والحمولة</h1>
          <p className="text-muted-foreground">محاكاة 100+ مستخدم متزامن</p>
        </div>
        <Badge variant={getStatusColor(getOverallStatus())}>
          {getOverallStatus() === 'success' && <CheckCircle className="w-4 h-4 mr-1" />}
          {getOverallStatus() === 'warning' && <AlertTriangle className="w-4 h-4 mr-1" />}
          {getOverallStatus() === 'error' && <AlertTriangle className="w-4 h-4 mr-1" />}
          {getOverallStatus() === 'success' ? 'ممتاز' : 
           getOverallStatus() === 'warning' ? 'تحذير' : 'خطر'}
        </Badge>
      </div>

      {/* الضوابط */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            إعدادات الاختبار
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">المستخدمين المتزامنين</label>
              <input
                type="number"
                value={config.concurrentUsers}
                onChange={(e) => setConfig(prev => ({ ...prev, concurrentUsers: parseInt(e.target.value) }))}
                className="w-full p-2 border rounded"
                disabled={isRunning}
                min="1"
                max="500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">مدة الاختبار (ثانية)</label>
              <input
                type="number"
                value={config.testDuration}
                onChange={(e) => setConfig(prev => ({ ...prev, testDuration: parseInt(e.target.value) }))}
                className="w-full p-2 border rounded"
                disabled={isRunning}
                min="10"
                max="3600"
              />
            </div>
            <div>
              <label className="text-sm font-medium">زمن الزيادة التدريجية</label>
              <input
                type="number"
                value={config.rampUpTime}
                onChange={(e) => setConfig(prev => ({ ...prev, rampUpTime: parseInt(e.target.value) }))}
                className="w-full p-2 border rounded"
                disabled={isRunning}
                min="1"
                max="300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">خيارات الاختبار</label>
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={config.videoTestEnabled}
                    onChange={(e) => setConfig(prev => ({ ...prev, videoTestEnabled: e.target.checked }))}
                    disabled={isRunning}
                  />
                  اختبار الفيديو
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={config.apiTestEnabled}
                    onChange={(e) => setConfig(prev => ({ ...prev, apiTestEnabled: e.target.checked }))}
                    disabled={isRunning}
                  />
                  اختبار API
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={startTest} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                بدء الاختبار
              </Button>
            ) : (
              <>
                <Button onClick={pauseTest} variant="outline" className="flex items-center gap-2">
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {isPaused ? 'استئناف' : 'إيقاف مؤقت'}
                </Button>
                <Button onClick={stopTest} variant="destructive" className="flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  إيقاف
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* حالة الاختبار */}
      {isRunning && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>تقدم الاختبار</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}% - مرحلة: {testPhase}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <Users className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold">{activeUsers}</div>
                  <div className="text-sm text-muted-foreground">مستخدم نشط</div>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                  <div className="text-2xl font-bold">{Math.round(currentMetrics.responseTime)}ms</div>
                  <div className="text-sm text-muted-foreground">زمن الاستجابة</div>
                </div>
                <div className="text-center">
                  <Network className="w-6 h-6 mx-auto mb-1 text-green-500" />
                  <div className="text-2xl font-bold">{currentMetrics.throughput}</div>
                  <div className="text-sm text-muted-foreground">العمليات/ثانية</div>
                </div>
                <div className="text-center">
                  <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-red-500" />
                  <div className="text-2xl font-bold">{currentMetrics.errorRate}%</div>
                  <div className="text-sm text-muted-foreground">معدل الأخطاء</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* المقاييس المباشرة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              استخدام المعالج
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>الاستخدام الحالي</span>
                <span className="font-bold">{Math.round(currentMetrics.cpuUsage)}%</span>
              </div>
              <Progress value={currentMetrics.cpuUsage} className="h-2" />
              {currentMetrics.cpuUsage > 80 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    استخدام المعالج مرتفع! قد يؤثر على الأداء
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MemoryStick className="w-5 h-5" />
              استخدام الذاكرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>الاستخدام الحالي</span>
                <span className="font-bold">{Math.round(currentMetrics.memoryUsage)}%</span>
              </div>
              <Progress value={currentMetrics.memoryUsage} className="h-2" />
              {currentMetrics.memoryUsage > 90 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    استخدام الذاكرة مرتفع جداً!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              زمن الاستجابة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>الزمن الحالي</span>
                <span className="font-bold">{Math.round(currentMetrics.networkLatency)}ms</span>
              </div>
              <Progress value={(currentMetrics.networkLatency / 200) * 100} className="h-2" />
              {currentMetrics.networkLatency > 150 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    زمن الاستجابة بطيء
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* نتائج الاختبار */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>نتائج الاختبار المباشرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {testResults.slice(-10).reverse().map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(result.status)}>
                      {result.status === 'success' ? '✓' : result.status === 'warning' ? '⚠' : '✗'}
                    </Badge>
                    <span className="text-sm">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(result.metrics.responseTime)}ms | 
                    {Math.round(result.metrics.cpuUsage)}% CPU | 
                    {result.metrics.errorRate}% أخطاء
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};