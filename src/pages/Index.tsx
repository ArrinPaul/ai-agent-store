
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import FeaturedAgent from "@/components/FeaturedAgent";
import AgentCard from "@/components/AgentCard";
import BottomMenu from "@/components/BottomMenu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, TrendingUp, Download, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  downloads: number;
  search_count: number;
  featured: boolean;
}

interface SectionProps {
  title: string;
  icon: typeof Search;
  apps: App[];
  isLoading: boolean;
  emptyMessage?: string;
}

const AppSection = ({ title, icon: Icon, apps, isLoading, emptyMessage = "No apps found" }: SectionProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </h2>
        <button 
          onClick={() => navigate('/apps')}
          className="text-primary hover:underline"
        >
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={`skeleton-${i}`} className="flex flex-col space-y-3 rounded-xl border p-4">
              <Skeleton className="h-32 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))
        ) : apps.length > 0 ? (
          apps.map((app) => (
            <AgentCard key={app.id} {...app} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mostSearched, setMostSearched] = useState<App[]>([]);
  const [topDownloaded, setTopDownloaded] = useState<App[]>([]);
  const [featuredApps, setFeaturedApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchApps = useCallback(async () => {
    try {
      // Run all requests in parallel for better performance
      const [searchResponse, downloadResponse, featuredResponse] = await Promise.all([
        supabase.from("apps").select("*").order("search_count", { ascending: false }).limit(4),
        supabase.from("apps").select("*").order("downloads", { ascending: false }).limit(4),
        supabase.from("apps").select("*").eq("featured", true).limit(4)
      ]);
      
      if (searchResponse.error) throw searchResponse.error;
      if (downloadResponse.error) throw downloadResponse.error;
      if (featuredResponse.error) throw featuredResponse.error;
      
      setMostSearched(searchResponse.data || []);
      setTopDownloaded(downloadResponse.data || []);
      setFeaturedApps(featuredResponse.data || []);
    } catch (error: any) {
      console.error("Error fetching apps:", error);
      toast.error("Failed to load apps");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
    
    // Auto-refresh data every 5 minutes
    const refreshInterval = setInterval(fetchApps, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [fetchApps]);

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

  return (
    <div className="min-h-screen bg-background pb-32">
      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Search Section */}
          <div className="mt-4 mb-8">
            <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AI agents..."
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <FeaturedAgent />
          
          <div className="mt-12 p-6 bg-secondary/20 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">1.2M+</p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
              <div className="bg-background p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Active Agents</p>
              </div>
              <div className="bg-background p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">50k+</p>
                <p className="text-sm text-muted-foreground">Daily Users</p>
              </div>
              <div className="bg-background p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">4.8</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>

          <AppSection 
            title="Most Searched This Week" 
            icon={TrendingUp}
            apps={mostSearched} 
            isLoading={isLoading}
            emptyMessage="No trending apps yet"
          />

          <AppSection 
            title="Top Downloaded" 
            icon={Download}
            apps={topDownloaded} 
            isLoading={isLoading}
          />

          <AppSection 
            title="Featured Apps" 
            icon={Star}
            apps={featuredApps} 
            isLoading={isLoading}
            emptyMessage="No featured apps found"
          />
        </div>
      </main>
      {isMenuOpen && <BottomMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}
    </div>
  );
};

export default Index;
