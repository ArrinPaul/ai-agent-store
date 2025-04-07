
import { Home, Grid, Bookmark, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const TabBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
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
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background/80 backdrop-blur-lg z-40 animate-fadeIn">
      <div className="grid grid-cols-4 h-full max-w-md mx-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-200",
              tab.active 
                ? "text-primary scale-105" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-full transition-colors",
              tab.active ? "bg-primary/10" : ""
            )}>
              <tab.icon className={cn(
                "h-5 w-5",
                tab.active && "text-primary"
              )} />
            </div>
            <span className={cn(
              "text-xs font-medium transition-all",
              tab.active && "font-semibold"
            )}>{tab.label}</span>
            
            {tab.active && (
              <div className="absolute bottom-0 w-10 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
