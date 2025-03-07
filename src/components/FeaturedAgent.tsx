
import { useState, useEffect } from "react";
import { ArrowRight, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const FeaturedAgent = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [featuredAgent, setFeaturedAgent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedAgent = async () => {
      try {
        const { data, error } = await supabase
          .from("apps")
          .select("*")
          .eq("featured", true)
          .order("downloads", { ascending: false })
          .limit(1)
          .single();
        
        if (error) throw error;
        setFeaturedAgent(data);
      } catch (error) {
        console.error("Error fetching featured agent:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedAgent();
  }, []);

  const handleTryNow = () => {
    toast.info("Feature coming soon!");
  };

  if (isLoading) {
    return (
      <div className="relative h-[500px] w-full overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse">
        <div className="absolute inset-0 bg-grid-white/10" />
      </div>
    );
  }

  return (
    <div 
      className="relative h-[500px] w-full overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-fadeIn transition-all duration-300"
      style={{ transform: isHovered ? 'scale(1.01)' : 'scale(1)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-grid-white/10" />
      {featuredAgent && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary mb-4 backdrop-blur-sm">
              Featured Agent
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              {featuredAgent.name}
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-2xl">
              {featuredAgent.description}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-black/30 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>4.8</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                <Users className="h-4 w-4" />
                <span>{featuredAgent.downloads.toLocaleString()} users</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleTryNow}
                className="flex items-center gap-2 px-8 py-6 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                size="lg"
              >
                Try Now
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 px-8 py-6 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-colors"
                size="lg"
                onClick={() => toast.info("Learn more feature coming soon!")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedAgent;
