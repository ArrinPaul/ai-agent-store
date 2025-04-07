
import { Home, Grid, Bookmark, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const TabBar = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);
  
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
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background/80 backdrop-blur-lg z-40">
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
              <div className="absolute bottom-0 h-1 w-10 bg-primary rounded-full animate-fadeIn" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
