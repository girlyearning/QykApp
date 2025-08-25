import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0e4d9b6c176d49cfb0a7989300ea533e',
  appName: 'qykapp',
  webDir: 'dist',
  server: {
    url: 'https://0e4d9b6c-176d-49cf-b0a7-989300ea533e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;