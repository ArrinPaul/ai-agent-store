
import { createContext, useContext, useState, ReactNode } from "react";

type MobileAppContextType = {
  isInstalled: boolean;
  isOnline: boolean;
  installPrompt: () => void;
  setIsInstalled: (value: boolean) => void;
};

const MobileAppContext = createContext<MobileAppContextType>({
  isInstalled: false,
  isOnline: true,
  installPrompt: () => {},
  setIsInstalled: () => {},
});

export const MobileAppProvider = ({ children }: { children: ReactNode }) => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  
  // Check online status
  useState(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });
  
  const installPrompt = () => {
    // In a real app, this would trigger the PWA install prompt
    console.log('Install prompt triggered');
    // For demo purposes, we'll just set it to installed
    setIsInstalled(true);
  };
  
  return (
    <MobileAppContext.Provider value={{ 
      isInstalled, 
      isOnline, 
      installPrompt,
      setIsInstalled 
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
