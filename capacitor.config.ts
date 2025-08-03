import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.eb38da82050847aba7218f18f35976ba',
  appName: 'al-deem-training-hub-34',
  webDir: 'dist',
  server: {
    url: 'https://eb38da82-0508-47ab-a721-8f18f35976ba.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a1a1a",
      showSpinner: true,
      spinnerColor: "#ffffff"
    }
  }
};

export default config;