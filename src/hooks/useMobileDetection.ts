import { useState, useEffect } from 'react';

interface MobileState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
  isNative: boolean;
}

export const useMobileDetection = () => {
  const [mobileState, setMobileState] = useState<MobileState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 0,
    screenHeight: 0,
    orientation: 'landscape',
    touchSupport: false,
    isNative: false
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      const orientation = width > height ? 'landscape' : 'portrait';
      const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Check if running in Capacitor (native app)
      const isNative = !!(window as any).Capacitor;

      setMobileState({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        orientation,
        touchSupport,
        isNative
      });
    };

    // Initial check
    checkDevice();

    // Listen for window resize
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return mobileState;
};