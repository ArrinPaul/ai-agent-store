
import React, { createContext, ReactNode } from "react";
const { useContext, useState, useEffect } = React;

type MobileAppContextType = {
  isInstalled: boolean;
  isOnline: boolean;
  installPrompt: () => void;
  setIsInstalled: (value: boolean) => void;
  isIOS: boolean;
  isStandalone: boolean;
  installPromptShown: boolean;
  setInstallPromptShown: (value: boolean) => void;
  isAndroid: boolean;
};

const MobileAppContext = createContext<MobileAppContextType>({
  isInstalled: false,
  isOnline: true,
  installPrompt: () => {},
  setIsInstalled: () => {},
  isIOS: false,
  isStandalone: false,
  installPromptShown: false,
  setInstallPromptShown: () => {},
  isAndroid: false,
});

export const MobileAppProvider = ({ children }: { children: ReactNode }) => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [installPromptShown, setInstallPromptShown] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  
  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    // Detect platform
    const detectPlatform = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      
      // Check if iOS
      const iOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      setIsIOS(iOS);
      
      // Check if Android
      const android = /android/i.test(userAgent);
      setIsAndroid(android);
      
      // Check if running as PWA
      const isStandalone = 'standalone' in window.navigator && (window.navigator as any).standalone === true;
      const displayMode = window.matchMedia('(display-mode: standalone)').matches;
      setIsStandalone(isStandalone || displayMode);
      
      // Update installed state
      setIsInstalled(isStandalone || displayMode);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('appinstalled', () => setIsInstalled(true));
    
    // Initial detection
    setIsOnline(navigator.onLine);
    detectPlatform();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const installPrompt = () => {
    // This function can be enhanced later to use the actual install prompt
    console.log('Install prompt triggered');
    setInstallPromptShown(true);
  };
  
  return (
    <MobileAppContext.Provider value={{ 
      isInstalled, 
      isOnline,
      installPrompt,
      setIsInstalled,
      isIOS,
      isStandalone,
      installPromptShown,
      setInstallPromptShown,
      isAndroid
    }}>
      {children}
    </MobileAppContext.Provider>
  );
};

export const useMobileApp = () => {
  const context = useContext(MobileAppContext);
  if (context === undefined) {
    throw new Error("useMobileApp must be used within a MobileAppProvider");
  }
  return context;
};
