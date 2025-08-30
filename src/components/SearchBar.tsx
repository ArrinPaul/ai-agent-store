import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  hideOnMobile?: boolean;
}

const SearchBar = ({ className = "", hideOnMobile = false }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<{name: string, type: 'suggestion' | 'recent' | 'category'}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches).slice(0, 3));
    }
  }, []);

  const saveRecentSearch = useCallback((term: string) => {
    const storedSearches = localStorage.getItem('recentSearches');
    let searches = storedSearches ? JSON.parse(storedSearches) : [];
    
    searches = searches.filter((s: string) => s !== term);
    
    searches.unshift(term);
    
    searches = searches.slice(0, 5);
    
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    setRecentSearches(searches.slice(0, 3));
  }, []);

  useEffect(() => {
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
        if (recentSearches.length > 0) {
          setSuggestions(recentSearches.map(term => ({ 
            name: term, 
            type: 'recent' as const
          })));
        } else {
          setSuggestions([]);
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // Mock suggestions for now
      const mockSuggestions = [
        { name: "AI Assistant", type: 'suggestion' as const },
        { name: "Image Generator", type: 'suggestion' as const },
        { name: "Productivity", type: 'category' as const },
        { name: "Photography", type: 'category' as const }
      ].filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      setTimeout(() => {
        setSuggestions(mockSuggestions);
        setIsLoading(false);
      }, 300);
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, recentSearches]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    setShowSuggestions(false);
    saveRecentSearch(searchTerm.trim());
    
    // Mock search for now
    const mockResults = [
      { id: "1", name: "AI Assistant", category: "Productivity" },
      { id: "2", name: "Image Generator", category: "Photography" }
    ].filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    localStorage.setItem("searchResults", JSON.stringify(mockResults));
    
    navigate(`/apps?search=${encodeURIComponent(searchTerm)}`);
    toast.success(`Found ${mockResults.length} results for "${searchTerm}"`);
  };

  const selectSuggestion = (suggestion: string, type: 'suggestion' | 'recent' | 'category') => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    
    if (type === 'category') {
      navigate(`/apps?category=${encodeURIComponent(suggestion)}`);
    } else {
      setTimeout(() => {
        if (inputRef.current) {
          const form = inputRef.current.form;
          if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      }, 100);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSearch} className={cn(
      "relative",
      hideOnMobile ? "hidden md:block" : "",
      className
    )}>
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
          className="pl-10 pr-16 rounded-full bg-background/80 transition-all focus:ring-2 focus:ring-primary/20 border border-input/80 hover:border-input"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-14 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted/50"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Button 
          type="submit" 
          size="sm" 
          className="absolute right-1 rounded-full hover:bg-primary/90 active:scale-95"
        >
          <Search className="h-4 w-4 mr-1" />
          <span className="sr-only md:not-sr-only">Search</span>
        </Button>
      </div>
      
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div 
          ref={suggestionsRef}
          className="absolute mt-1 w-full bg-background rounded-xl shadow-lg border border-border z-50 animate-fadeIn"
        >
          <div className="py-1.5">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader size="sm" variant="dots" />
              </div>
            ) : (
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index}
                    className="px-4 py-2.5 hover:bg-muted/50 cursor-pointer transition-colors flex items-center gap-2"
                    onClick={() => selectSuggestion(suggestion.name, suggestion.type)}
                  >
                    {suggestion.type === 'recent' ? (
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : suggestion.type === 'category' ? (
                      <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className="flex-1 truncate">{suggestion.name}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground opacity-70" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchBar;
