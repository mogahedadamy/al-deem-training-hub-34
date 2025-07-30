import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Zap, Clock, Wifi } from 'lucide-react';
import { useNetworkOptimization } from '@/hooks/useNetworkOptimization';

interface LoadingOptimizerProps {
  onOptimizationComplete?: (settings: any) => void;
  initialLoad?: boolean;
}

export const LoadingOptimizer: React.FC<LoadingOptimizerProps> = ({
  onOptimizationComplete,
  initialLoad = true
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(initialLoad);
  
  const {
    networkState,
    optimizationSettings,
    getNetworkScore,
    getRecommendedVideoQuality
  } = useNetworkOptimization();

  const optimizationSteps = [
    {
      title: 'فحص جودة الاتصال',
      description: 'جاري تحليل سرعة الإنترنت',
      icon: Wifi,
      duration: 1000
    },
    {
      title: 'تحسين إعدادات الفيديو',
      description: 'اختيار أفضل جودة للفيديو',
      icon: Zap,
      duration: 800
    },
    {
      title: 'تهيئة التخزين المؤقت',
      description: 'إعداد التحميل المسبق',
      icon: Clock,
      duration: 600
    }
  ];

  useEffect(() => {
    if (!isOptimizing) return;

    const runOptimization = async () => {
      for (let i = 0; i < optimizationSteps.length; i++) {
        setCurrentStep(i);
        
        // Simulate optimization work
        const step = optimizationSteps[i];
        const stepProgress = (i / optimizationSteps.length) * 100;
        
        for (let j = 0; j <= 100; j += 10) {
          setProgress(stepProgress + (j / optimizationSteps.length));
          await new Promise(resolve => setTimeout(resolve, step.duration / 10));
        }
      }

      // Complete optimization
      setProgress(100);
      setTimeout(() => {
        setIsOptimizing(false);
        onOptimizationComplete?.({
          networkScore: getNetworkScore(),
          recommendedQuality: getRecommendedVideoQuality(),
          optimizationSettings
        });
      }, 500);
    };

    runOptimization();
  }, [isOptimizing]);

  if (!isOptimizing) {
    return null;
  }

  const currentStepData = optimizationSteps[currentStep];
  const StepIcon = currentStepData?.icon || Loader2;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <StepIcon className="w-8 h-8 text-primary animate-pulse" />
              </div>
              {currentStep < optimizationSteps.length && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{currentStep + 1}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {currentStepData?.title || 'جاري التحسين...'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentStepData?.description || 'تحسين الأداء لأفضل تجربة تعلم'}
              </p>
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>التقدم</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>سرعة الاتصال:</span>
              <span className="font-medium">
                {networkState.downlink.toFixed(1)} Mbps
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>نوع الشبكة:</span>
              <span className="font-medium">
                {networkState.effectiveType.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>نقاط الأداء:</span>
              <span className="font-medium">
                {getNetworkScore()}/100
              </span>
            </div>
          </div>

          {/* Steps indicator */}
          <div className="flex justify-center space-x-2">
            {optimizationSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};