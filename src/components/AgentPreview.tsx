
import { useState, useEffect } from "react";
import { X, Star, Download, Share2, ChevronLeft, ChevronRight, Info, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentPreviewProps {
  agentId: string;
  onClose: () => void;
}

const AgentPreview = ({ agentId, onClose }: AgentPreviewProps) => {
  const [agent, setAgent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Mock data for preview
  const previewImages = [
    "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618767147421-a0e5f8c5dfb0?q=80&w=1974&auto=format&fit=crop"
  ];

  // Mock features and prompts
  const features = [
    "Seamless integration with your existing workflow",
    "Advanced natural language processing capabilities",
    "Real-time data analysis and visualization",
    "Customizable responses and behavior",
    "Multi-language support for global usage"
  ];

  const samplePrompts = [
    "Analyze this quarterly sales report and identify key trends",
    "Write a professional email response to a client inquiry",
    "Create a summary of the attached research paper",
    "Generate a creative marketing campaign for our new product",
    "Translate this document to Spanish while maintaining context"
  ];

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const { data, error } = await supabase
          .from("apps")
          .select("*")
          .eq("id", agentId)
          .single();
        
        if (error) throw error;
        setAgent(data);
      } catch (error) {
        console.error("Error fetching agent:", error);
        toast.error("Failed to load agent details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgent();

    // Add keyboard event listeners for navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [agentId, onClose]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? previewImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === previewImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleRateAgent = (rating: number) => {
    setUserRating(rating);
    toast.success(`You rated this agent ${rating} stars!`);
  };

  const handleShare = () => {
    // Copy link to clipboard
    navigator.clipboard.writeText(`https://example.com/agent/${agentId}`).then(
      () => toast.success("Link copied to clipboard!"),
      () => toast.error("Failed to copy link")
    );
  };

  const handleDownload = async () => {
    if (!agent) return;
    
    setIsDownloading(true);
    try {
      // Update downloads count in Supabase
      const { error } = await supabase
        .from("apps")
        .update({ downloads: (agent.downloads || 0) + 1 })
        .eq("id", agentId);

      if (error) throw error;

      toast.success("Download started successfully!");
      
      // Simulate download delay
      setTimeout(() => {
        setIsDownloading(false);
        toast.success(`${agent.name} has been added to your agents!`);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to start download");
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-background rounded-xl p-6 w-full max-w-4xl h-[80vh] animate-pulse flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-background rounded-xl p-6 w-full max-w-4xl animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-destructive">Agent Not Found</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-muted-foreground mb-4">Sorry, we couldn't find the agent you're looking for.</p>
          <Button onClick={onClose}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-4 animate-fadeIn">
      <div className="bg-background rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-background z-10">
          <h2 className="text-2xl font-bold truncate">{agent.name}</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Content */}
          <div className="flex flex-col lg:flex-row">
            {/* Image gallery */}
            <div className="w-full lg:w-1/2 relative">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={previewImages[currentImageIndex] || agent.image_url} 
                  alt={`${agent.name} preview ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                
                {/* Navigation controls */}
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                
                {/* Image counter */}
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/30 text-white text-xs backdrop-blur-sm">
                  {currentImageIndex + 1} / {previewImages.length}
                </div>
              </div>
              
              {/* User rating */}
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rate this agent:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRateAgent(star)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star 
                            className={cn(
                              "h-5 w-5",
                              userRating && star <= userRating 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300 hover:text-yellow-400"
                            )} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {agent.downloads?.toLocaleString() || 0} downloads
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={handleDownload} 
                    disabled={isDownloading}
                    className="flex-1"
                  >
                    {isDownloading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download Agent
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleShare} className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Info tabs */}
            <div className="w-full lg:w-1/2 p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview" className="flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="features" className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>Features</span>
                  </TabsTrigger>
                  <TabsTrigger value="prompts" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Sample Prompts</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{agent.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Category</h3>
                    <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {agent.category}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="space-y-4">
                  <h3 className="text-lg font-semibold">Key Features</h3>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-1 bg-primary/20 text-primary rounded-full p-1">
                          <Star className="h-3 w-3" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="prompts" className="space-y-4">
                  <h3 className="text-lg font-semibold">Try These Prompts</h3>
                  <div className="space-y-2">
                    {samplePrompts.map((prompt, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(prompt);
                          toast.success("Prompt copied to clipboard");
                        }}
                      >
                        <p className="text-sm">{prompt}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPreview;
