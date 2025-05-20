
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7cb2e6a6c0ce4144880b4d98defe0d6e',
  appName: 'ai-agent-store',
  webDir: 'dist',
  server: {
    url: 'https://7cb2e6a6-c0ce-4144-880b-4d98defe0d6e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  ios: {
    contentInset: "always"
  },
  android: {
    backgroundColor: "#000000"
  }
};

export default config;
