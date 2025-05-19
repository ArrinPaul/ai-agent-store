
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import TabBar from "@/components/TabBar";
import OfflineIndicator from "@/components/OfflineIndicator";

interface MobileAppShellProps {
  children: ReactNode;
}

const MobileAppShell = ({ children }: MobileAppShellProps) => {
  const location = useLocation();
  const { session } = useAuth();
  const [showNav, setShowNav] = useState(true);
  const [showTabBar, setShowTabBar] = useState(true);
  
  // Control navigation visibility based on route
  useEffect(() => {
    const authPage = location.pathname === "/auth";
    const notFoundPage = location.pathname === "/404";
    const hiddenNavPages = [authPage, notFoundPage];
    
    setShowNav(!hiddenNavPages.includes(true));
    setShowTabBar(!hiddenNavPages.includes(true));
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
};

export default MobileAppShell;
