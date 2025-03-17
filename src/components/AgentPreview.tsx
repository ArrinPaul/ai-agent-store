
import { useState, useEffect, useRef } from "react";
import { X, Star, Download, Share2, ChevronLeft, ChevronRight, Info, MessageSquare, Filter, Clock, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";

interface AgentPreviewProps {
  agentId: string;
  onClose: () => void;
}

interface Review {
  id: string;
  user_id: string;
  username?: string; // Make username optional since it might not exist in the database
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
}

const AgentPreview = ({ agentId, onClose }: AgentPreviewProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { session } = useAuth();
  const [agent, setAgent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userReview, setUserReview] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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

  // Mock reviews if none exist
  const mockReviews: Review[] = [
    {
      id: "mock-1",
      user_id: "user-1",
      username: "AIEnthusiast",
      rating: 5,
      comment: "This is exactly what I needed for my workflow. The responses are incredibly accurate and it saved me hours of work!",
      created_at: "2023-10-15T14:23:45Z",
      helpful_count: 12
    },
    {
      id: "mock-2",
      user_id: "user-2",
      username: "TechExplorer",
      rating: 4,
      comment: "Very impressive capabilities. It integrates well with my existing tools, though there are occasional hiccups with complex requests.",
      created_at: "2023-11-05T09:12:30Z",
      helpful_count: 7
    },
    {
      id: "mock-3",
      user_id: "user-3",
      username: "DigitalNomad",
      rating: 5,
      comment: "Game changer for my remote work setup. The multi-language support is flawless!",
      created_at: "2023-12-20T16:45:22Z",
      helpful_count: 19
    }
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
        
        // Fetch user reviews
        const { data: reviewData, error: reviewError } = await supabase
          .from("app_reviews")
          .select("*")
          .eq("app_id", agentId)
          .order("created_at", { ascending: false });
          
        if (reviewError) throw reviewError;
        
        if (reviewData && reviewData.length > 0) {
          // Transform the data to match the Review interface by adding username if missing
          const formattedReviews: Review[] = reviewData.map(review => ({
            ...review,
            // Use email prefix or user_id substring as username if not provided
            username: review.username || (review.user_id ? review.user_id.substring(0, 8) : "Anonymous")
          }));
          setReviews(formattedReviews);
        } else {
          // Use mock reviews if no real ones exist
          setReviews(mockReviews);
        }
        
        // Check if user has already rated
        if (session?.user) {
          const { data: userRatingData } = await supabase
            .from("app_reviews")
            .select("rating, comment")
            .eq("app_id", agentId)
            .eq("user_id", session.user.id)
            .single();
            
          if (userRatingData) {
            setUserRating(userRatingData.rating);
            setUserReview(userRatingData.comment || "");
          }
        }
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
      // Tab navigation within modal
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
          if (e.shiftKey && document.activeElement === focusableElements[0]) {
            (focusableElements[focusableElements.length - 1] as HTMLElement).focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === focusableElements[focusableElements.length - 1]) {
            (focusableElements[0] as HTMLElement).focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [agentId, onClose, session?.user]);

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

  const handleRateAgent = async (rating: number) => {
    if (!session?.user) {
      toast.error("Please log in to rate this agent");
      return;
    }
    
    setUserRating(rating);
    
    // If user has a review comment, submit both together
    if (userReview) {
      await submitReview(rating, userReview);
    } else {
      toast.success(`You rated this agent ${rating} stars!`);
    }
  };

  const submitReview = async (rating: number = userRating || 5, comment: string = userReview) => {
    if (!session?.user) {
      toast.error("Please log in to submit a review");
      return;
    }
    
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    
    setIsSubmittingReview(true);
    try {
      // Check if user has already reviewed
      const { data: existingReview } = await supabase
        .from("app_reviews")
        .select("id")
        .eq("app_id", agentId)
        .eq("user_id", session.user.id)
        .single();
      
      // Generate a username from the user's email
      const username = session.user.email?.split('@')[0] || "User";
        
      if (existingReview) {
        // Update existing review
        await supabase
          .from("app_reviews")
          .update({ 
            rating, 
            comment,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingReview.id);
          
        toast.success("Your review has been updated!");
      } else {
        // Create new review
        await supabase
          .from("app_reviews")
          .insert({
            app_id: agentId,
            user_id: session.user.id,
            username: username,
            rating,
            comment,
            created_at: new Date().toISOString(),
            helpful_count: 0
          });
          
        toast.success("Your review has been submitted!");
        
        // Add to the reviews list
        const newReview: Review = {
          id: Date.now().toString(),
          user_id: session.user.id,
          username: username,
          rating,
          comment,
          created_at: new Date().toISOString(),
          helpful_count: 0
        };
        
        setReviews([newReview, ...reviews]);
      }
      
      // Reset the form
      setUserReview("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
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

  const markReviewHelpful = async (reviewId: string) => {
    if (!session?.user) {
      toast.error("Please log in to mark reviews as helpful");
      return;
    }
    
    try {
      // Update helpful count
      const updatedReviews = reviews.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            helpful_count: review.helpful_count + 1
          };
        }
        return review;
      });
      
      setReviews(updatedReviews);
      
      // Save to database if not a mock review
      if (!reviewId.startsWith("mock")) {
        await supabase
          .from("app_reviews")
          .update({ helpful_count: reviews.find(r => r.id === reviewId)!.helpful_count + 1 })
          .eq("id", reviewId);
      }
      
      toast.success("Thanks for your feedback!");
    } catch (error) {
      console.error("Error marking review as helpful:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="loading-title">
        <div className="bg-background rounded-xl p-6 w-full max-w-4xl h-[80vh] animate-pulse flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
          <span className="sr-only" id="loading-title">Loading agent details</span>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="error-title">
        <div className="bg-background rounded-xl p-6 w-full max-w-4xl animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-destructive" id="error-title">Agent Not Found</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full" aria-label="Close dialog">
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
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-4 animate-fadeIn" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="agent-preview-title"
    >
      <div ref={modalRef} className="bg-background rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-background z-10">
          <h2 className="text-2xl font-bold truncate" id="agent-preview-title">{agent.name}</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
            aria-label="Close dialog"
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
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                
                {/* Image counter and dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2">
                  {previewImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImageIndex === index 
                          ? "bg-white w-4" 
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                      aria-current={currentImageIndex === index ? "true" : "false"}
                    />
                  ))}
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
                          aria-label={`Rate ${star} stars`}
                          aria-pressed={userRating === star ? "true" : "false"}
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
                <TabsList className="w-full grid grid-cols-4 mb-4">
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
                    <span>Prompts</span>
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Reviews</span>
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
                
                <TabsContent value="reviews" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-2">User Reviews</h3>
                  
                  {/* Review submission form */}
                  {session?.user && (
                    <div className="p-4 border rounded-lg mb-4">
                      <h4 className="text-sm font-medium mb-2">Write a Review</h4>
                      <Textarea 
                        placeholder="Share your experience with this agent..."
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        className="mb-3"
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm mr-2">Your rating:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={`review-star-${star}`}
                                onClick={() => setUserRating(star)}
                                className="p-1"
                              >
                                <Star 
                                  className={cn(
                                    "h-4 w-4",
                                    userRating && star <= userRating 
                                      ? "text-yellow-400 fill-yellow-400" 
                                      : "text-gray-300 hover:text-yellow-400"
                                  )} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <Button 
                          onClick={() => submitReview()} 
                          size="sm"
                          disabled={isSubmittingReview || !userRating}
                        >
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Reviews list */}
                  <div className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarFallback>{review.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{review.username}</p>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={cn(
                                        "h-3 w-3",
                                        i < review.rating 
                                          ? "text-yellow-400 fill-yellow-400" 
                                          : "text-gray-300"
                                      )} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(review.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-sm my-2">{review.comment}</p>
                          <div className="flex justify-between items-center mt-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs flex items-center"
                              onClick={() => markReviewHelpful(review.id)}
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Helpful ({review.helpful_count})
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">No reviews yet. Be the first to review!</p>
                    )}
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
