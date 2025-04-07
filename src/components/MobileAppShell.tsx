
import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMobileApp } from "@/contexts/MobileAppContext";
import { Wifi, WifiOff, Download, ArrowUp } from "lucide-react";
import TabBar from "./TabBar";

interface MobileAppShellProps {
  children: ReactNode;
}

const MobileAppShell = ({ children }: MobileAppShellProps) => {
  const { isInstalled, isOnline, installPrompt } = useMobileApp();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  
  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground z-50 p-2 flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">You're offline</span>
        </div>
      )}
      
      {/* Install prompt - only show on mobile and if not installed */}
      {!isInstalled && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && (
        <div className="fixed bottom-[70px] left-4 right-4 bg-primary text-primary-foreground z-40 p-3 rounded-lg flex items-center justify-between shadow-lg">
          <span className="text-sm font-medium">Install for a better experience</span>
          <button 
            onClick={installPrompt}
            className="flex items-center gap-1 bg-white/20 text-white px-3 py-1 rounded-full text-sm"
          >
            <Download className="h-4 w-4" /> Install
          </button>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 pb-16">
        {children}
      </div>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-20 right-4 z-40 p-2 bg-primary text-primary-foreground rounded-full shadow-lg"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      
      {/* Bottom tab bar - fixed at bottom */}
      <TabBar />
    </div>
  );
};

export default MobileAppShell;
