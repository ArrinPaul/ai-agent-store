
import { useState, useEffect } from "react";
import { ArrowRight, Star, Users, Check, Award, Eye } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
    const mockAgent = {
      id: "featured-1",
      name: "AI Assistant Pro",
      description: "Advanced AI assistant for professional workflows, data analysis, and productivity enhancement.",
      downloads: 15420,
      featured: true,
      image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
    };
    
    setTimeout(() => {
      setFeaturedAgent(mockAgent);
      setIsLoading(false);
    }, 500);
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
      <div className="relative h-[280px] md:h-[320px] w-full overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-black/40 to-black/20 animate-pulse">
        <div className="absolute inset-0 bg-grid-white/10" />
      </div>
    );
  }

  return (
    <>
      <div 
        className="relative h-[280px] md:h-[320px] w-full overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-black/30 to-black/10 animate-fadeIn transition-all duration-300 active:scale-98 md:hover:scale-[1.01] cursor-pointer"
        style={{ 
          transform: isHovered ? 'scale(1.01)' : 'scale(1)',
          boxShadow: isHovered ? '0 10px 40px rgba(0, 0, 0, 0.1)' : 'none',
          backgroundImage: 'url("https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
        
        {featuredAgent && (
          <div className="absolute inset-0">
            <div 
              className="absolute top-3 md:top-4 left-3 md:left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm flex items-center gap-2 transition-all duration-300"
              style={{ 
                transform: isHovered ? 'translateY(2px)' : 'translateY(0)',
                opacity: isHovered ? 1 : 0.9
              }}
            >
              <Award className="h-3 w-3 md:h-4 md:w-4 text-primary animate-pulse" />
              <span className="text-primary font-semibold text-xs md:text-sm">Featured Agent</span>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
              <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-3">
                <div className="flex items-center gap-1 md:gap-2 bg-black/40 text-white px-2 py-1 rounded-full backdrop-blur-sm text-xs">
                  <Star className="h-3 w-3 text-yellow-400" />
                  <span>4.8</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 bg-black/40 text-white px-2 py-1 rounded-full backdrop-blur-sm text-xs">
                  <Users className="h-3 w-3" />
                  <span>{featuredAgent.downloads.toLocaleString()} users</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 bg-black/40 text-white px-2 py-1 rounded-full backdrop-blur-sm text-xs">
                  <Check className="h-3 w-3 text-green-400" />
                  <span>Verified</span>
                </div>
              </div>
              
              <h1 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 text-white">
                {featuredAgent.name}
              </h1>
              
              <p className="text-sm md:text-base text-white/80 mb-3 md:mb-4 max-w-2xl line-clamp-2">
                {featuredAgent.description}
              </p>
              
              {!userRating && (
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <span className="text-white/80 text-xs">Rate:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRateAgent(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star 
                          className="h-3 w-3 md:h-4 md:w-4 text-gray-300 hover:text-yellow-400 transition-colors" 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {userRating && (
                <div className="flex items-center gap-2 mb-3 md:mb-4 bg-black/40 text-white px-2 py-1 rounded-full backdrop-blur-sm inline-block text-xs">
                  <span>Your rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`h-3 w-3 ${star <= userRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleTryNow}
                  className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all hover:scale-105 text-xs md:text-sm"
                  size="sm"
                >
                  Try Now
                  <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105 text-xs md:text-sm"
                  size="sm"
                  onClick={handleShowVideo}
                >
                  <Eye className="h-3 w-3 md:h-4 md:w-4" />
                  Preview
                </Button>
                
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105 text-xs md:text-sm"
                  size="sm"
                  onClick={handleAddToFavorites}
                >
                  <Star className="h-3 w-3 md:h-4 md:w-4" />
                  Favorite
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
