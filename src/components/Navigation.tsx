
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
    <nav className="glass-effect fixed top-0 w-full z-50 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            AI Store
          </Link>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <button
              onClick={handleUpload}
              className="hidden md:flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Upload className="h-4 w-4" />
              Upload Agent
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className="hover:opacity-80 transition-opacity">
                <UserCircle className="h-8 w-8" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfile("Profile settings")}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfile("My uploads")}>
                  My Uploads
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfile("Favorites")}>
                  Favorites
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfile("Sign out")}>
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
