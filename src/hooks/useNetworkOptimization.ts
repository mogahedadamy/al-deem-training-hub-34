import { useState, useEffect, useCallback } from 'react';

interface NetworkState {
  isOnline: boolean;
  connectionType: string;
  downlink: number;
  effectiveType: string;
  saveData: boolean;
}

interface OptimizationSettings {
  videoQuality: 'auto' | '360p' | '720p' | '1080p';
  prefetchEnabled: boolean;
  adaptiveBitrate: boolean;
  compressionLevel: 'low' | 'medium' | 'high';
}

export const useNetworkOptimization = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: navigator.onLine,
    connectionType: 'unknown',
    downlink: 0,
    effectiveType: 'unknown',
    saveData: false
  });

  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>({
    videoQuality: 'auto',
    prefetchEnabled: true,
    adaptiveBitrate: true,
    compressionLevel: 'medium'
  });

  // Monitor network changes
  useEffect(() => {
    const updateNetworkState = () => {
      const connection = (navigator as any).connection;
      
      setNetworkState({
        isOnline: navigator.onLine,
        connectionType: connection?.type || 'unknown',
        downlink: connection?.downlink || 0,
        effectiveType: connection?.effectiveType || 'unknown',
        saveData: connection?.saveData || false
      });
    };

    const handleOnline = () => updateNetworkState();
    const handleOffline = () => updateNetworkState();
    const handleConnectionChange = () => updateNetworkState();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Initial update
    updateNetworkState();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  // Auto-adjust settings based on network
  useEffect(() => {
    if (!networkState.isOnline) return;

    const autoOptimize = () => {
      let newSettings = { ...optimizationSettings };

      // Adjust video quality based on connection
      if (networkState.saveData || networkState.downlink < 1) {
        newSettings.videoQuality = '360p';
        newSettings.prefetchEnabled = false;
        newSettings.compressionLevel = 'high';
      } else if (networkState.downlink < 5) {
        newSettings.videoQuality = '720p';
        newSettings.prefetchEnabled = true;
        newSettings.compressionLevel = 'medium';
      } else {
        newSettings.videoQuality = 'auto';
        newSettings.prefetchEnabled = true;
        newSettings.compressionLevel = 'low';
      }

      // Disable adaptive bitrate on very slow connections
      newSettings.adaptiveBitrate = networkState.downlink > 0.5;

      setOptimizationSettings(newSettings);
    };

    autoOptimize();
  }, [networkState]);

  // Get recommended video quality
  const getRecommendedVideoQuality = useCallback(() => {
    if (!networkState.isOnline) return '360p';
    
    if (networkState.saveData) return '360p';
    
    if (networkState.downlink > 15) return '1080p';
    if (networkState.downlink > 5) return '720p';
    return '360p';
  }, [networkState]);

  // Check if prefetching should be enabled
  const shouldPrefetch = useCallback(() => {
    return (
      networkState.isOnline &&
      !networkState.saveData &&
      networkState.downlink > 2 &&
      optimizationSettings.prefetchEnabled
    );
  }, [networkState, optimizationSettings]);

  // Get buffer size based on connection
  const getOptimalBufferSize = useCallback(() => {
    if (!networkState.isOnline) return 0;
    
    if (networkState.downlink > 10) return 60; // 60 seconds
    if (networkState.downlink > 5) return 30;  // 30 seconds
    if (networkState.downlink > 2) return 15;  // 15 seconds
    return 5; // 5 seconds minimum
  }, [networkState]);

  // Get chunk size for video segments
  const getOptimalChunkSize = useCallback(() => {
    if (networkState.downlink > 10) return 10; // 10 second chunks
    if (networkState.downlink > 5) return 6;   // 6 second chunks
    if (networkState.downlink > 2) return 4;   // 4 second chunks
    return 2; // 2 second chunks for slow connections
  }, [networkState]);

  // Update settings manually
  const updateSettings = useCallback((newSettings: Partial<OptimizationSettings>) => {
    setOptimizationSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Get network performance score
  const getNetworkScore = useCallback(() => {
    if (!networkState.isOnline) return 0;
    
    let score = 100;
    
    // Downlink speed impact
    if (networkState.downlink < 1) score -= 50;
    else if (networkState.downlink < 5) score -= 25;
    else if (networkState.downlink < 10) score -= 10;
    
    // Connection type impact
    if (networkState.effectiveType === 'slow-2g') score -= 40;
    else if (networkState.effectiveType === '2g') score -= 30;
    else if (networkState.effectiveType === '3g') score -= 15;
    
    // Save data mode
    if (networkState.saveData) score -= 20;
    
    return Math.max(0, score);
  }, [networkState]);

  // Estimate download time
  const estimateDownloadTime = useCallback((fileSizeMB: number) => {
    if (!networkState.isOnline || networkState.downlink === 0) return Infinity;
    
    // Convert Mbps to MBps (divide by 8)
    const downloadSpeedMBps = networkState.downlink / 8;
    return fileSizeMB / downloadSpeedMBps; // seconds
  }, [networkState]);

  return {
    networkState,
    optimizationSettings,
    getRecommendedVideoQuality,
    shouldPrefetch,
    getOptimalBufferSize,
    getOptimalChunkSize,
    updateSettings,
    getNetworkScore,
    estimateDownloadTime
  };
};