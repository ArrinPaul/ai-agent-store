
import { ReactNode, useEffect, useState, memo } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import TabBar from "@/components/TabBar";
import OfflineIndicator from "@/components/OfflineIndicator";

interface MobileAppShellProps {
  children: ReactNode;
}

const MobileAppShell = memo(({ children }: MobileAppShellProps) => {
  const location = useLocation();
  const { session } = useAuth();
  const [showNav, setShowNav] = useState(true);
  const [showTabBar, setShowTabBar] = useState(true);
  
  // More efficient route-based navigation visibility control
  useEffect(() => {
    const hiddenNavPaths = ["/auth", "/404"];
    const shouldShowNav = !hiddenNavPaths.includes(location.pathname);
    
    setShowNav(shouldShowNav);
    setShowTabBar(shouldShowNav);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showNav && session && <Navigation />}
      
      <main className={`flex-1 ${showNav && session ? "pt-16" : ""}`}>
        {children}
      </main>
      
      <OfflineIndicator />
      {showTabBar && session && <TabBar />}
    </div>
  );
});

MobileAppShell.displayName = "MobileAppShell";

export default MobileAppShell;
