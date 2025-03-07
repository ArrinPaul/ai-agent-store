
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SearchBar = ({ className = "" }: { className?: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .ilike("name", `%${searchTerm}%`)
        .order("downloads", { ascending: false });
      
      if (error) throw error;
      
      // Store search results in localStorage to avoid state loss on navigation
      localStorage.setItem("searchResults", JSON.stringify(data));
      
      // Update search_count for matching apps
      if (data.length > 0) {
        const updatePromises = data.map(app => 
          supabase
            .from("apps")
            .update({ search_count: (app.search_count || 0) + 1 })
            .eq("id", app.id)
        );
        
        await Promise.all(updatePromises);
      }
      
      // Navigate to apps page with search query
      navigate(`/apps?search=${encodeURIComponent(searchTerm)}`);
      toast.success(`Found ${data.length} results for "${searchTerm}"`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to perform search");
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative flex w-full items-center">
        <Input
          type="text"
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10 rounded-full bg-background/80 transition-all focus:ring-2 focus:ring-primary/20"
        />
        <Button 
          type="submit" 
          size="icon" 
          variant="ghost" 
          className="absolute right-0 rounded-full hover:bg-primary/10"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
