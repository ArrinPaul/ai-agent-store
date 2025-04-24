
import { Home, Grid, Bookmark, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TabBar = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [showTabBar, setShowTabBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);
  
  // Enhanced scroll handling with smoother transitions
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show tabbar when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowTabBar(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setShowTabBar(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  
  const tabs = [
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
      active: currentPath === "/apps" || currentPath.startsWith("/apps/") && !currentPath.includes("bookmarks")
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
  ];
  
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
              <div className={cn(
                "p-2 rounded-full transition-colors duration-300",
                tab.active ? "bg-primary/10 scale-110" : "hover:bg-background/90 active:bg-primary/5"
              )}>
                <tab.icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  tab.active ? "text-primary" : "text-muted-foreground"
                )} />
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
};

export default TabBar;
