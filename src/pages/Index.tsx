
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import FeaturedAgent from "@/components/FeaturedAgent";
import AgentCard from "@/components/AgentCard";
import BottomMenu from "@/components/BottomMenu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [mostSearched, setMostSearched] = useState<App[]>([]);
  const [topDownloaded, setTopDownloaded] = useState<App[]>([]);
  const [featuredApps, setFeaturedApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        // Fetch most searched apps
        const { data: searchedData, error: searchError } = await supabase
          .from("apps")
          .select("*")
          .order("search_count", { ascending: false })
          .limit(4);

        if (searchError) throw searchError;
        setMostSearched(searchedData || []);

        // Fetch top downloaded apps
        const { data: downloadedData, error: downloadError } = await supabase
          .from("apps")
          .select("*")
          .order("downloads", { ascending: false })
          .limit(4);

        if (downloadError) throw downloadError;
        setTopDownloaded(downloadedData || []);

        // Fetch featured apps
        const { data: featuredData, error: featuredError } = await supabase
          .from("apps")
          .select("*")
          .eq("featured", true)
          .limit(4);

        if (featuredError) throw featuredError;
        setFeaturedApps(featuredData || []);
      } catch (error: any) {
        console.error("Error fetching apps:", error);
        toast.error("Failed to load apps");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApps();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <main className="pt-32 md:pt-20">
        <div className="container mx-auto px-4 py-8">
          <FeaturedAgent />
          
          <div className="mt-12 p-6 bg-secondary/20 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Most Searched This Week</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mostSearched.map((app) => (
                <AgentCard key={app.id} {...app} />
              ))}
              {mostSearched.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground">
                  No apps found
                </p>
              )}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Top Downloaded</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topDownloaded.map((app) => (
                <AgentCard key={app.id} {...app} />
              ))}
              {topDownloaded.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground">
                  No apps found
                </p>
              )}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Featured Apps</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredApps.map((app) => (
                <AgentCard key={app.id} {...app} />
              ))}
              {featuredApps.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground">
                  No featured apps found
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <BottomMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default Index;
