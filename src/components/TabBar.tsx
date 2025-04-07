
import { Home, Search, Bookmark, User, Grid } from "lucide-react";
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
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background/80 backdrop-blur-lg z-40">
      <div className="grid grid-cols-4 h-full">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              tab.active 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className={cn(
              "h-5 w-5",
              tab.active && "text-primary"
            )} />
            <span className="text-xs font-medium">{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
