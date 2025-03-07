
import Navigation from "@/components/Navigation";
import BottomMenu from "@/components/BottomMenu";
import AgentCard from "@/components/AgentCard";
import SearchBar from "@/components/SearchBar";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  downloads: number;
}

const categories = ["All", "Chatbots", "Image Generation", "Data Analysis", "Productivity", "Entertainment"];

const Apps = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  const [searchResults, setSearchResults] = useState<App[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('downloads', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    // If there's a search query, get results from localStorage
    if (searchQuery) {
      const results = localStorage.getItem("searchResults");
      if (results) {
        setSearchResults(JSON.parse(results));
      }
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Filter apps by selected category
  const filteredApps = selectedCategory === "All" 
    ? (searchQuery ? searchResults : apps)
    : (searchQuery ? searchResults : apps).filter(app => app.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <main className="pt-32 md:pt-24 pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold animate-fade-in">
                {searchQuery ? "Search Results" : "Browse Agents"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {searchQuery
                  ? `Showing results for "${searchQuery}"`
                  : "Discover amazing AI applications"}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <SearchBar className="md:w-64" />
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {categories.map(category => (
                      <DropdownMenuItem 
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={category === selectedCategory ? "bg-secondary" : ""}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button className="w-full md:w-auto gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Agent
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-[400px] rounded-2xl bg-secondary/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {filteredApps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredApps.map((app) => (
                    <AgentCard
                      key={app.id}
                      id={app.id}
                      name={app.name}
                      description={app.description}
                      category={app.category}
                      image_url={app.image_url}
                      downloads={app.downloads}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">
                    {searchQuery
                      ? "No results found for your search"
                      : "No apps available yet."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <BottomMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default Apps;
