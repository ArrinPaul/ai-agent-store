
import Navigation from "@/components/Navigation";
import BottomMenu from "@/components/BottomMenu";
import AgentCard from "@/components/AgentCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <main className="pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Apps</h1>
              <p className="text-muted-foreground mt-1">Discover amazing applications</p>
            </div>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
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
              {apps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apps.map((app) => (
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
                  <p className="text-xl text-muted-foreground">No apps available yet.</p>
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
