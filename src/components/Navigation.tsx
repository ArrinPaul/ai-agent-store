
import { Search, Upload, Menu } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import BottomMenu from "./BottomMenu";

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for: ${searchQuery}`);
  };

  const handleUpload = () => {
    toast.info("Upload feature coming soon!");
  };

  const handleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="glass-effect fixed top-0 w-full z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleMenu}
              className="p-2 hover:bg-secondary/80 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="text-2xl font-bold">AI Store</div>
          </div>
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
          </div>
        </div>
      </nav>
      <BottomMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Navigation;
