
import { Moon, Sun, Upload, UserCircle, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { cn } from "@/lib/utils";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleUpload = () => {
    navigate("/apps");
    toast.info("Upload feature coming soon!");
  };

  const handleProfile = async (action: string) => {
    setMobileMenuOpen(false);
    
    switch (action) {
      case "Profile settings":
        navigate("/profile");
        break;
      case "My uploads":
        navigate("/apps");
        break;
      case "Sign out":
        toast.info("Sign out feature coming soon!");
        break;
      default:
        toast.info(`${action} coming soon!`);
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300",
      scrolled 
        ? "glass-effect shadow-sm backdrop-blur-lg" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text transition-all duration-300"
          >
            AI Store
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
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
              className="items-center gap-2 rounded-full"
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

          {/* Mobile Nav Toggle */}
          <div className="flex md:hidden items-center gap-2">
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
              variant="ghost"
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-effect border-t animate-fadeIn">
          <div className="container mx-auto py-4 px-4 space-y-4">
            <Button 
              onClick={handleUpload}
              className="w-full flex items-center justify-center gap-2"
              size="sm"
            >
              <Upload className="h-4 w-4" />
              Upload Agent
            </Button>
            
            <div className="border-t pt-4 space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => handleProfile("Profile settings")}
              >
                Profile Settings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => handleProfile("My uploads")}
              >
                My Uploads
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => handleProfile("Favorites")}
              >
                Favorites
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive" 
                onClick={() => handleProfile("Sign out")}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
