
import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMobileApp } from "@/contexts/MobileAppContext";
import { Wifi, WifiOff, Download, ArrowUp, XCircle } from "lucide-react";
import TabBar from "./TabBar";
import { toast } from "sonner";

interface MobileAppShellProps {
  children: ReactNode;
}

const MobileAppShell = ({ children }: MobileAppShellProps) => {
  const { isInstalled, isOnline, installPrompt } = useMobileApp();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(!isOnline);
  const location = useLocation();
  
  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Show installation prompt after 5 seconds if not installed
  useEffect(() => {
    if (!isInstalled && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isInstalled]);
  
  // Update offline banner when online status changes
  useEffect(() => {
    setShowOfflineBanner(!isOnline);
    
    if (!isOnline) {
      toast.error("You're offline. Some features may be limited.");
    } else if (showOfflineBanner) {
      toast.success("You're back online!");
    }
  }, [isOnline]);
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset states on route change
    setShowScrollTop(false);
  }, [location.pathname]);
  
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleInstall = () => {
    installPrompt();
    setShowInstallPrompt(false);
  };
  
  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    // Store in localStorage to prevent showing again for a week
    localStorage.setItem('installPromptDismissed', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
  };
  
  // Don't show TabBar on auth page
  const showTabBar = !location.pathname.includes('/auth');
  
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      {/* Offline indicator */}
      {showOfflineBanner && (
        <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground z-50 p-2 flex items-center justify-center gap-2 animate-slideIn">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">You're offline</span>
          <button 
            onClick={() => setShowOfflineBanner(false)}
            className="ml-auto p-1 rounded-full hover:bg-destructive-foreground/10"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Install prompt - only show on mobile and if not installed */}
      {showInstallPrompt && !isInstalled && !location.pathname.includes('/auth') && (
        <div className="fixed bottom-[70px] left-4 right-4 bg-primary text-primary-foreground z-40 p-4 rounded-lg flex items-center justify-between shadow-lg animate-scaleIn">
          <div>
            <h3 className="font-semibold mb-1">Install App</h3>
            <p className="text-sm opacity-90">Add to home screen for a better experience</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={dismissInstallPrompt}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Dismiss"
            >
              <XCircle className="h-5 w-5" />
            </button>
            <button 
              onClick={handleInstall}
              className="flex items-center gap-1 bg-white/20 text-white px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-colors"
            >
              <Download className="h-4 w-4" /> Install
            </button>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className={`flex-1 ${showTabBar ? 'pb-16' : ''}`}>
        {children}
      </div>
      
      {/* Scroll to top button */}
      {showScrollTop && showTabBar && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-20 right-4 z-40 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors animate-fadeIn active:scale-95"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      
      {/* Bottom tab bar - fixed at bottom */}
      {showTabBar && <TabBar />}
    </div>
  );
};

export default MobileAppShell;
