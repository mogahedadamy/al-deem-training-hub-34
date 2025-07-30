import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNetworkOptimization } from '@/hooks/useNetworkOptimization';

interface PerformanceSettings {
  enableAnimations: boolean;
  videoQuality: 'auto' | '360p' | '720p' | '1080p';
  prefetchContent: boolean;
  enableLazyLoading: boolean;
  maxConcurrentRequests: number;
  cacheSize: number;
}

interface PerformanceContextType {
  settings: PerformanceSettings;
  updateSettings: (newSettings: Partial<PerformanceSettings>) => void;
  networkScore: number;
  isOptimizing: boolean;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return context;
};

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  const { networkState, getNetworkScore, getRecommendedVideoQuality } = useNetworkOptimization();
  const [isOptimizing, setIsOptimizing] = useState(true);
  
  const [settings, setSettings] = useState<PerformanceSettings>({
    enableAnimations: true,
    videoQuality: 'auto',
    prefetchContent: true,
    enableLazyLoading: true,
    maxConcurrentRequests: 6,
    cacheSize: 50 // MB
  });

  // Auto-optimize based on network conditions
  useEffect(() => {
    const optimizeForNetwork = () => {
      const networkScore = getNetworkScore();
      const recommendedQuality = getRecommendedVideoQuality();
      
      let newSettings: Partial<PerformanceSettings> = {};

      // Poor network (< 40% score)
      if (networkScore < 40) {
        newSettings = {
          enableAnimations: false,
          videoQuality: '360p',
          prefetchContent: false,
          maxConcurrentRequests: 2,
          cacheSize: 20
        };
      }
      // Average network (40-70% score)
      else if (networkScore < 70) {
        newSettings = {
          enableAnimations: true,
          videoQuality: recommendedQuality as any,
          prefetchContent: false,
          maxConcurrentRequests: 4,
          cacheSize: 35
        };
      }
      // Good network (70%+ score)
      else {
        newSettings = {
          enableAnimations: true,
          videoQuality: recommendedQuality as any,
          prefetchContent: true,
          maxConcurrentRequests: 6,
          cacheSize: 50
        };
      }

      setSettings(prev => ({ ...prev, ...newSettings }));
      setIsOptimizing(false);
    };

    // Initial optimization
    setTimeout(optimizeForNetwork, 1000);

    // Re-optimize when network changes
    const interval = setInterval(() => {
      if (networkState.isOnline) {
        optimizeForNetwork();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [networkState, getNetworkScore, getRecommendedVideoQuality]);

  const updateSettings = (newSettings: Partial<PerformanceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value: PerformanceContextType = {
    settings,
    updateSettings,
    networkScore: getNetworkScore(),
    isOptimizing
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};