import { useState, useEffect } from "react";
import { ArrowRight, Star, Users, Check, Award, Eye } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import AgentPreview from "./AgentPreview";

const FeaturedAgent = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [featuredAgent, setFeaturedAgent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

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
    if (featuredAgent) {
      navigate(`/apps/${featuredAgent.id}`);
    } else {
      toast.info("Feature coming soon!");
    }
  };

  const handleShowVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (featuredAgent) {
      setShowPreview(true);
    } else {
      toast.info("Opening quick preview");
    }
  };

  const handleRateAgent = (rating: number) => {
    setUserRating(rating);
    toast.success(`You rated this agent ${rating} stars!`);
  };

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Added to your favorites!");
  };

  const handleCardClick = () => {
    if (featuredAgent) {
      navigate(`/apps/${featuredAgent.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="relative h-[500px] w-full overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/20 animate-pulse">
        <div className="absolute inset-0 bg-grid-white/10" />
      </div>
    );
  }

  return (
    <>
      <div 
        className="relative h-[500px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-background to-secondary/30 animate-fadeIn transition-all duration-300 cursor-pointer"
        style={{ 
          transform: isHovered ? 'scale(1.01)' : 'scale(1)',
          boxShadow: isHovered ? '0 10px 40px rgba(0, 0, 0, 0.1)' : 'none' 
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div className="absolute inset-0 bg-grid-white/10 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" 
               style={{ 
                 transform: isHovered ? 'translateX(5px) translateY(-5px)' : 'translate(0, 0)',
                 transition: 'transform 0.5s ease-out'
               }} />
        </div>
        
        {featuredAgent && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent dark:from-black/80 dark:via-black/50" />
            
            <div 
              className="absolute top-6 left-6 px-4 py-1 rounded-full bg-primary/10 backdrop-blur-sm flex items-center gap-2 transition-all duration-300"
              style={{ 
                transform: isHovered ? 'translateY(3px)' : 'translateY(0)',
                opacity: isHovered ? 1 : 0.9
              }}
            >
              <Award className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-primary font-semibold">Featured Agent</span>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-black/40 text-white px-3 py-1 rounded-full backdrop-blur-sm dark:bg-white/10">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>4.8</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 text-white px-3 py-1 rounded-full backdrop-blur-sm dark:bg-white/10">
                  <Users className="h-4 w-4" />
                  <span>{featuredAgent.downloads.toLocaleString()} users</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 text-white px-3 py-1 rounded-full backdrop-blur-sm dark:bg-white/10">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Verified</span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                {featuredAgent.name}
              </h1>
              
              <p className="text-lg text-white/80 mb-8 max-w-2xl">
                {featuredAgent.description}
              </p>
              
              {!userRating && (
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-white/80 text-sm">Rate this agent:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRateAgent(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star 
                          className="h-5 w-5 text-gray-300 hover:text-yellow-400 transition-colors" 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {userRating && (
                <div className="flex items-center gap-2 mb-6 bg-black/40 text-white px-3 py-1 rounded-full backdrop-blur-sm inline-block dark:bg-white/10">
                  <span>Your rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`h-4 w-4 ${star <= userRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleTryNow}
                  className="flex items-center gap-2 px-8 py-6 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all hover:scale-105"
                  size="lg"
                >
                  Try Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-8 py-6 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105 dark:bg-black/40 dark:hover:bg-black/60"
                  size="lg"
                  onClick={handleShowVideo}
                >
                  <Eye className="h-4 w-4" />
                  Quick Preview
                </Button>
                
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-8 py-6 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105 dark:bg-black/40 dark:hover:bg-black/60"
                  size="lg"
                  onClick={handleAddToFavorites}
                >
                  <Star className="h-4 w-4" />
                  Add to Favorites
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {showPreview && featuredAgent && (
        <AgentPreview agentId={featuredAgent.id} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
};

export default FeaturedAgent;
