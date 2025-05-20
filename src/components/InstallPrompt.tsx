
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMobileApp } from '@/contexts/MobileAppContext';
import { motion } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent;
  }
}

const InstallPrompt = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { isInstalled, setIsInstalled } = useMobileApp();
  
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      event.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPromptEvent(event);
      
      // Only show the prompt if the user hasn't already installed the app
      // and hasn't dismissed the prompt recently
      const lastPromptTime = localStorage.getItem('installPromptDismissed');
      if (!lastPromptTime || Date.now() - Number(lastPromptTime) > 24 * 60 * 60 * 1000) {
        setShowPrompt(true);
      }
    };
    
    // Detection for iOS (Safari)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isInStandaloneMode = 'standalone' in window.navigator && (window.navigator as any).standalone;
    
    // Check if should show iOS install instructions
    if (isIOS && !isInStandaloneMode && !localStorage.getItem('iosInstallDismissed')) {
      setShowPrompt(true);
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    
    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    };
  }, [setIsInstalled]);
  
  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      return;
    }
    
    // Show the install prompt
    installPromptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await installPromptEvent.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstalled(true);
    } else {
      console.log('User dismissed the install prompt');
      localStorage.setItem('installPromptDismissed', Date.now().toString());
    }
    
    setInstallPromptEvent(null);
    setShowPrompt(false);
  };
  
  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', Date.now().toString());
    
    // For iOS, track that we've dismissed this prompt
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      localStorage.setItem('iosInstallDismissed', 'true');
    }
  };
  
  // Don't show if already installed or prompt is hidden
  if (isInstalled || !showPrompt) {
    return null;
  }
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-20 left-4 right-4 z-50"
    >
      <Card className="p-4 shadow-lg border-primary/20 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-bold text-lg">Install our app</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isIOS 
                ? 'Add this app to your home screen: tap Share then "Add to Home Screen"' 
                : 'Install this app for a better experience and offline access'}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDismiss} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {!isIOS && (
          <Button 
            onClick={handleInstallClick} 
            className="mt-3 w-full"
          >
            Install App
          </Button>
        )}
      </Card>
    </motion.div>
  );
};

export default InstallPrompt;
