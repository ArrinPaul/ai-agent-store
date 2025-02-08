
import { Search } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="glass-effect fixed top-0 w-full z-50 border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold">AI Store</div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search AI agents..."
              className="pl-10 pr-4 py-2 rounded-full bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 focus:outline-none w-64"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Upload Agent
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
