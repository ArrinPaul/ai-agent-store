
import Navigation from "@/components/Navigation";
import BottomMenu from "@/components/BottomMenu";
import AgentCard from "@/components/AgentCard";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  downloads: number;
}

const Apps = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  const [searchResults, setSearchResults] = useState<App[]>([]);

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

  const displayedApps = searchQuery ? searchResults : apps;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <main className="pt-32 md:pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {searchQuery ? "Search Results" : "Apps"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {searchQuery
                  ? `Showing results for "${searchQuery}"`
                  : "Discover amazing applications"}
              </p>
            </div>
            <button className="w-full md:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
              Upload New App
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-[400px] rounded-2xl bg-secondary/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {displayedApps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedApps.map((app) => (
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
