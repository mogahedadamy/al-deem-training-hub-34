import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Wifi, WifiOff, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  networkSpeed: number;
  memoryUsage: number;
  connectionType: string;
  isOnline: boolean;
  videoBuffer: number;
  lastVideoError: string | null;
}

interface PerformanceMonitorProps {
  onMetricsChange?: (metrics: PerformanceMetrics) => void;
  showAlert?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetricsChange,
  showAlert = true
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    networkSpeed: 0,
    memoryUsage: 0,
    connectionType: 'unknown',
    isOnline: navigator.onLine,
    videoBuffer: 0,
    lastVideoError: null
  });

  const [showDetails, setShowDetails] = useState(false);

  // Monitor network connection
  useEffect(() => {
    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection;
      const newMetrics = {
        ...metrics,
        isOnline: navigator.onLine,
        networkSpeed: connection?.downlink || 0,
        connectionType: connection?.effectiveType || 'unknown'
      };
      setMetrics(newMetrics);
      onMetricsChange?.(newMetrics);
    };

    const handleOnline = () => updateNetworkInfo();
    const handleOffline = () => updateNetworkInfo();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    updateNetworkInfo();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor performance
  useEffect(() => {
    const updatePerformanceMetrics = () => {
      // Memory usage
      const memory = (performance as any).memory;
      const memoryUsage = memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0;

      // Load time
      const navigation = performance.getEntriesByType('navigation')[0] as any;
      const loadTime = navigation ? navigation.loadEventEnd - navigation.fetchStart : 0;

      setMetrics(prev => ({
        ...prev,
        memoryUsage,
        loadTime
      }));
    };

    // Update metrics every 10 seconds
    const interval = setInterval(updatePerformanceMetrics, 10000);
    updatePerformanceMetrics(); // Initial check

    return () => clearInterval(interval);
  }, []);

  // Get connection quality
  const getConnectionQuality = () => {
    if (!metrics.isOnline) return { level: 'offline', color: 'destructive', text: 'غير متصل' };
    
    if (metrics.networkSpeed > 10) return { level: 'excellent', color: 'default', text: 'ممتاز' };
    if (metrics.networkSpeed > 5) return { level: 'good', color: 'secondary', text: 'جيد' };
    if (metrics.networkSpeed > 1) return { level: 'fair', color: 'outline', text: 'متوسط' };
    return { level: 'poor', color: 'destructive', text: 'ضعيف' };
  };

  // Get performance status
  const getPerformanceStatus = () => {
    const score = calculatePerformanceScore();
    if (score >= 80) return { status: 'excellent', color: 'default', icon: CheckCircle };
    if (score >= 60) return { status: 'good', color: 'secondary', icon: Zap };
    return { status: 'poor', color: 'destructive', icon: AlertTriangle };
  };

  const calculatePerformanceScore = () => {
    let score = 100;
    
    // Network penalty
    if (metrics.networkSpeed < 1) score -= 30;
    else if (metrics.networkSpeed < 5) score -= 15;
    
    // Memory penalty
    if (metrics.memoryUsage > 80) score -= 20;
    else if (metrics.memoryUsage > 60) score -= 10;
    
    // Load time penalty
    if (metrics.loadTime > 5000) score -= 20;
    else if (metrics.loadTime > 3000) score -= 10;
    
    return Math.max(0, score);
  };

  const connectionQuality = getConnectionQuality();
  const performanceStatus = getPerformanceStatus();
  const performanceScore = calculatePerformanceScore();

  return (
    <div className="space-y-4">
      {/* Performance Alert */}
      {showAlert && performanceScore < 60 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            أداء الشبكة ضعيف. قد تواجه بطئ في تحميل الفيديوهات.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Status */}
      <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
        <div className="flex items-center space-x-3">
          {metrics.isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          <div>
            <p className="font-medium">حالة الاتصال</p>
            <p className="text-sm text-muted-foreground">
              {metrics.networkSpeed.toFixed(1)} Mbps - {connectionQuality.text}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={connectionQuality.color as any}>
            {connectionQuality.text}
          </Badge>
          <Badge variant={performanceStatus.color as any}>
            {performanceScore}%
          </Badge>
        </div>
      </div>

      {/* Detailed Metrics */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              مقاييس الأداء التفصيلية
              <performanceStatus.icon className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Network Speed */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">سرعة الشبكة</span>
                <span className="text-sm">{metrics.networkSpeed.toFixed(1)} Mbps</span>
              </div>
              <Progress value={Math.min(metrics.networkSpeed * 5, 100)} />
            </div>

            {/* Memory Usage */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">استخدام الذاكرة</span>
                <span className="text-sm">{metrics.memoryUsage.toFixed(1)}%</span>
              </div>
              <Progress 
                value={metrics.memoryUsage} 
                className={metrics.memoryUsage > 80 ? "bg-red-200" : ""}
              />
            </div>

            {/* Load Time */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">وقت التحميل</span>
                <span className="text-sm">{(metrics.loadTime / 1000).toFixed(2)}s</span>
              </div>
              <Progress value={Math.max(0, 100 - (metrics.loadTime / 100))} />
            </div>

            {/* Connection Type */}
            <div className="flex justify-between">
              <span className="text-sm font-medium">نوع الاتصال</span>
              <Badge variant="outline">{metrics.connectionType.toUpperCase()}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Toggle Details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-primary hover:underline"
      >
        {showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
      </button>
    </div>
  );
};