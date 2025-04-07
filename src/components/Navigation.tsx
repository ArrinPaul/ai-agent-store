
import { Moon, Sun, Upload, UserCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();

  const handleUpload = () => {
    navigate("/apps");
    toast.info("Upload feature coming soon!");
  };

  const handleProfile = async (action: string) => {
    switch (action) {
      case "Profile settings":
        navigate("/profile");
        break;
      case "My uploads":
        navigate("/apps");
        break;
      case "Sign out":
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          navigate("/auth");
          toast.success("Signed out successfully");
        } catch (error: any) {
          toast.error("Error signing out");
        }
        break;
      default:
        toast.info(`${action} coming soon!`);
    }
  };

  return (
    <nav className="glass-effect fixed top-0 left-0 right-0 z-50 border-b animate-fadeIn">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            AI Store
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <Button
              onClick={handleUpload}
              className="hidden md:flex items-center gap-2 rounded-full"
              size="sm"
            >
              <Upload className="h-4 w-4" />
              Upload Agent
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full border-2 border-primary/20 hover:border-primary/30">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 animate-fadeIn">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfile("Profile settings")} className="cursor-pointer">
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfile("My uploads")} className="cursor-pointer">
                  My Uploads
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfile("Favorites")} className="cursor-pointer">
                  Favorites
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfile("Sign out")} className="cursor-pointer text-destructive focus:text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
