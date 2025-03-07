
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SearchBar = ({ className = "" }: { className?: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("apps")
          .select("name")
          .ilike("name", `%${searchTerm}%`)
          .order("search_count", { ascending: false })
          .limit(5);

        if (error) throw error;
        setSuggestions(data.map(app => app.name));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

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

  const selectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    // Auto-submit after selecting a suggestion
    setTimeout(() => {
      if (inputRef.current) {
        const form = inputRef.current.form;
        if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    }, 100);
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative flex w-full items-center">
        <Search className="absolute left-3 text-muted-foreground h-4 w-4 pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="pl-10 pr-16 rounded-full bg-background/80 transition-all focus:ring-2 focus:ring-primary/20"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-14 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Button 
          type="submit" 
          size="sm" 
          className="absolute right-1 rounded-full hover:bg-primary/90"
        >
          Search
        </Button>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute mt-1 w-full bg-background rounded-xl shadow-lg border border-border z-50 animate-fade-in"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index}
                className="px-4 py-2 hover:bg-secondary cursor-pointer transition-colors flex items-center"
                onClick={() => selectSuggestion(suggestion)}
              >
                <Search className="h-3 w-3 text-muted-foreground mr-2" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default SearchBar;
