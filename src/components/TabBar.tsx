
import { Home, Grid, Bookmark, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const TabBar = memo(() => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [showTabBar, setShowTabBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasNotifications, setHasNotifications] = useState(false);
  
  useEffect(() => {
    setCurrentPath(location.pathname);
    
    // Simulate checking for notifications - in a real app this would come from a backend
    const checkNotifications = () => {
      // This would be a real API call in production
      setHasNotifications(Math.random() > 0.5);
    };
    
    checkNotifications();
  }, [location.pathname]);
  
  // Enhanced scroll handling with smoother transitions and throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setShowTabBar(false);
          } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
            setShowTabBar(true);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  
  const tabs = useMemo(() => [
    {
      icon: Home,
      label: "Home",
      path: "/",
      active: currentPath === "/"
    },
    {
      icon: Grid,
      label: "Apps",
      path: "/apps",
      active: currentPath === "/apps" || (currentPath.startsWith("/apps/") && !currentPath.includes("bookmarks"))
    },
    {
      icon: Bookmark,
      label: "Bookmarks",
      path: "/apps/bookmarks",
      active: currentPath === "/apps/bookmarks"
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      active: currentPath === "/profile"
    }
  ], [currentPath]);
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className={cn(
          "fixed bottom-0 left-0 right-0 h-16 border-t bg-background/90 backdrop-blur-lg z-40",
          showTabBar ? "translate-y-0" : "translate-y-full"
        )}
        initial={{ y: 100 }}
        animate={{ y: showTabBar ? 0 : 100 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="grid grid-cols-4 h-full max-w-md mx-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300",
                tab.active 
                  ? "text-primary scale-105" 
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              )}
            >
              <div className="relative">
                <div className={cn(
                  "p-2 rounded-full transition-colors duration-300",
                  tab.active ? "bg-primary/10 scale-110" : "hover:bg-background/90 active:bg-primary/5"
                )}>
                  <tab.icon className={cn(
                    "h-5 w-5 transition-all duration-300",
                    tab.active ? "text-primary" : "text-muted-foreground"
                  )} />
                  
                  {/* Notification indicator */}
                  {tab.label === "Profile" && hasNotifications && (
                    <Badge 
                      className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500"
                      variant="destructive" 
                    />
                  )}
                </div>
              </div>
              <span className={cn(
                "text-xs font-medium transition-all duration-300",
                tab.active ? "font-semibold" : ""
              )}>{tab.label}</span>
              
              {tab.active && (
                <motion.div 
                  className="absolute bottom-0 h-1 w-10 bg-primary rounded-full"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

TabBar.displayName = "TabBar";

export default TabBar;
