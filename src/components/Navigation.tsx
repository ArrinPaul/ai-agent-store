
import { Search, Upload, UserCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for: ${searchQuery}`);
  };

  const handleUpload = () => {
    toast.info("Upload feature coming soon!");
  };

  const handleProfile = (action: string) => {
    toast.info(`${action} coming soon!`);
  };

  return (
    <nav className="glass-effect fixed top-0 w-full z-50 border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold">AI Store</div>
        
        <div className="flex items-center space-x-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI agents..."
              className="pl-10 pr-4 py-2 rounded-full bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 focus:outline-none w-64"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </form>
          
          <button
            onClick={handleUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
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
    </nav>
  );
};

export default Navigation;
