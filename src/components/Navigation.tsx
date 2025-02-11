
import { Search, Upload, UserCircle } from "lucide-react";
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

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    try {
      const { data: searchResults, error } = await supabase
        .from("apps")
        .select("*")
        .ilike("name", `%${searchQuery}%`)
        .order("downloads", { ascending: false });

      if (error) throw error;

      // Update search count for found apps
      if (searchResults && searchResults.length > 0) {
        await Promise.all(
          searchResults.map((app) =>
            supabase
              .from("apps")
              .update({ search_count: (app.search_count || 0) + 1 })
              .eq("id", app.id)
          )
        );
      }

      // Store search results in localStorage
      localStorage.setItem("searchResults", JSON.stringify(searchResults));
      navigate("/apps?search=" + encodeURIComponent(searchQuery));
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to perform search");
    }
  };

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
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-bold">
              AI Store
            </Link>
            {isMobile && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden"
              >
                <Search className="h-6 w-6" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className={`${isSearchOpen || !isMobile ? "block" : "hidden"} md:block`}>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AI agents..."
                  className="w-full md:w-[300px] pl-10 pr-4 py-2 rounded-full bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </form>
            </div>

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
