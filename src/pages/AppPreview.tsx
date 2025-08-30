import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ChevronLeft, 
  Star, 
  Download, 
  Share2, 
  MessageSquare, 
  ThumbsUp, 
  Clock,
  Info,
  Filter,
  Heart,
  Bookmark 
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const AppPreview = () => {
  const { appId } = useParams();
  const [app, setApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userReview, setUserReview] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const previewImages = [
    "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618767147421-a0e5f8c5dfb0?q=80&w=1974&auto=format&fit=crop"
  ];

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

  const mockReviews = [
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
    const fetchApp = async () => {
      if (!appId) return;

      try {
        setIsLoading(true);
        
        // Mock app data
        const mockApp = {
          id: appId,
          name: "AI Assistant Pro",
          description: "Advanced AI assistant for professional workflows",
          downloads: 15420,
          image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
        };
        
        setApp(mockApp);
        setReviews(mockReviews);
      } catch (error) {
        console.error("Error fetching app:", error);
        toast.error("Failed to load app details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApp();
  }, [appId]);

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

  const handleRateApp = async (rating: number) => {
    setUserRating(rating);
    
    if (userReview) {
      await submitReview(rating, userReview);
    } else {
      toast.success(`You rated this app ${rating} stars!`);
    }
  };

  const submitReview = async (rating: number = userRating || 5, comment: string = userReview) => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    
    setIsSubmittingReview(true);
    
    const newReview = {
      id: Date.now().toString(),
      user_id: "current-user",
      username: "Current User",
      rating,
      comment,
      created_at: new Date().toISOString(),
      helpful_count: 0
    };
    
    setReviews([newReview, ...reviews]);
    setUserReview("");
    toast.success("Your review has been submitted!");
    setIsSubmittingReview(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/apps/${appId}`).then(
      () => toast.success("Link copied to clipboard!"),
      () => toast.error("Failed to copy link")
    );
  };

  const handleDownload = async () => {
    if (!app || !appId) return;
    
    setIsDownloading(true);
    toast.success("Download started successfully!");
    
    setTimeout(() => {
      setIsDownloading(false);
      toast.success(`${app.name} has been added to your apps!`);
    }, 1500);
  };

  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const toggleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Saved to bookmarks");
  };

  const markReviewHelpful = async (reviewId: string) => {
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
    toast.success("Thanks for your feedback!");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="h-[60vh] w-full rounded-xl bg-muted animate-pulse flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">App Not Found</h2>
        <p className="text-muted-foreground mb-4">Sorry, we couldn't find the app you're looking for.</p>
        <Button to="/apps">Browse Apps</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          to="/apps" 
          variant="ghost" 
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Apps
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full relative">
          <div className="aspect-video relative overflow-hidden rounded-xl">
            <img 
              src={previewImages[currentImageIndex] || app.image_url} 
              alt={`${app.name} preview ${currentImageIndex + 1}`}
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            
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
              <ChevronLeft className="h-6 w-6 rotate-180" />
            </button>
            
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

          <div className="mt-6 flex flex-wrap gap-3">
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
                  Download App
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleShare} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              onClick={toggleFavorite} 
              className={cn(
                "flex-1",
                isFavorite && "text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20"
              )}
            >
              <Heart className={cn(
                "h-4 w-4 mr-2",
                isFavorite && "fill-red-500"
              )} />
              {isFavorite ? "Favorited" : "Favorite"}
            </Button>
            <Button 
              variant="outline" 
              onClick={toggleBookmark} 
              className={cn(
                "flex-1",
                isBookmarked && "text-primary border-primary/20 hover:bg-primary/10"
              )}
            >
              <Bookmark className={cn(
                "h-4 w-4 mr-2",
                isBookmarked && "fill-primary"
              )} />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                {app.category}
              </span>
              {app.downloads > 0 && (
                <span className="text-xs text-muted-foreground">
                  {app.downloads.toLocaleString()} downloads
                </span>
              )}
              {app.rating && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-yellow-500" />
                  <span>{typeof app.rating === 'number' ? app.rating.toFixed(1) : '4.5'}</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold">{app.name}</h1>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-medium">Rate this app:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRateApp(star)}
                  className="p-1 hover:scale-110 transition-transform"
                  aria-label={`Rate ${star} stars`}
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
                <p className="text-muted-foreground">{app.description}</p>
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
              
              {false && (
                <div className="p-4 border rounded-lg mb-4">
                  <h4 className="text-sm font-medium mb-2">Write a Review</h4>
                  <Textarea 
                    placeholder="Share your experience with this app..."
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
  );
};

export default AppPreview;
