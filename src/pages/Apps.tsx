
import Navigation from "@/components/Navigation";
import BottomMenu from "@/components/BottomMenu";
import AgentCard from "@/components/AgentCard";
import SearchBar from "@/components/SearchBar";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { Filter, Plus, ArrowLeft, ArrowRight, ArrowUpDown, Bookmark, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  downloads: number;
  rating?: number;
  created_at?: string;
  bookmarked?: boolean;
}

const sampleApps: App[] = [
  {
    id: "sample-1",
    name: "Code Assistant Pro",
    description: "Advanced AI for coding help and pair programming. Perfect for developers of all skill levels.",
    category: "Productivity",
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    downloads: 18432,
    rating: 4.8,
    created_at: "2023-09-15T14:23:45Z"
  },
  {
    id: "sample-2",
    name: "Pixel Perfect",
    description: "Generate stunning, high-quality images from text prompts with advanced style controls.",
    category: "Image Generation",
    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    downloads: 24567,
    rating: 4.9,
    created_at: "2023-10-05T09:12:30Z"
  },
  {
    id: "sample-3",
    name: "Data Wizard",
    description: "Analyze complex datasets and create beautiful visualizations with simple prompts.",
    category: "Data Analysis",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    downloads: 12890,
    rating: 4.5,
    created_at: "2023-08-20T16:45:22Z"
  },
  {
    id: "sample-4",
    name: "Story Weaver",
    description: "Create immersive stories, characters, and dialogue for your next creative project.",
    category: "Entertainment",
    image_url: "https://images.unsplash.com/photo-1468273519810-8bbe53d3c9a0?q=80&w=2052&auto=format&fit=crop",
    downloads: 9876,
    rating: 4.3,
    created_at: "2023-11-10T11:33:21Z"
  },
  {
    id: "sample-5",
    name: "ChatMaster",
    description: "Advanced conversational AI that remembers context and adapts to your communication style.",
    category: "Chatbots",
    image_url: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=2074&auto=format&fit=crop",
    downloads: 31452,
    rating: 4.7,
    created_at: "2023-06-28T08:45:19Z"
  },
  {
    id: "sample-6",
    name: "Presentation Pro",
    description: "Generate beautiful slide decks and presentations with simple text prompts.",
    category: "Productivity",
    image_url: "https://images.unsplash.com/photo-1607970669494-54652c9e579c?q=80&w=2070&auto=format&fit=crop",
    downloads: 8745,
    rating: 4.2,
    created_at: "2023-12-05T14:22:33Z"
  },
  {
    id: "sample-7",
    name: "Dream Canvas",
    description: "Turn your imagination into beautiful artwork with this AI-powered painting assistant.",
    category: "Image Generation",
    image_url: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=2009&auto=format&fit=crop",
    downloads: 15789,
    rating: 4.6,
    created_at: "2023-07-17T09:11:45Z"
  },
  {
    id: "sample-8",
    name: "Marketing Genius",
    description: "Create compelling marketing copy, slogans, and campaign ideas for your business.",
    category: "Productivity",
    image_url: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=2070&auto=format&fit=crop",
    downloads: 7854,
    rating: 4.1,
    created_at: "2023-11-23T15:48:22Z"
  },
  {
    id: "sample-9",
    name: "MusicMind",
    description: "Generate original music compositions and melodies based on your mood and preferences.",
    category: "Entertainment",
    image_url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop",
    downloads: 13456,
    rating: 4.4,
    created_at: "2023-10-12T10:33:29Z"
  },
  {
    id: "sample-10",
    name: "Study Buddy",
    description: "Your personal AI tutor for any subject, helps with homework and exam preparation.",
    category: "Education",
    image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
    downloads: 19243,
    rating: 4.8,
    created_at: "2023-09-01T13:27:55Z"
  },
  {
    id: "sample-11",
    name: "Travel Assistant",
    description: "Plan your perfect vacation with AI-powered itineraries, recommendations, and local insights.",
    category: "Travel",
    image_url: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop",
    downloads: 11578,
    rating: 4.5,
    created_at: "2023-08-03T14:12:33Z"
  },
  {
    id: "sample-12",
    name: "Health Coach",
    description: "Personalized fitness plans, nutrition advice, and wellness tracking in one AI assistant.",
    category: "Health",
    image_url: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2070&auto=format&fit=crop",
    downloads: 22456,
    rating: 4.7,
    created_at: "2023-07-22T08:33:19Z"
  }
];

const categories = ["All", "Chatbots", "Image Generation", "Data Analysis", "Productivity", "Entertainment", "Education", "Travel", "Health"];

type SortOption = "popular" | "newest" | "highest-rated";

const Apps = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const location = useLocation();
  const { session } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  const [searchResults, setSearchResults] = useState<App[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const [bookmarkedApps, setBookmarkedApps] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const itemsPerPage = 6;

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('downloads', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length < 3) {
        return sampleApps;
      }
      
      return data || [];
    },
  });

  useEffect(() => {
    if (searchQuery) {
      const results = localStorage.getItem("searchResults");
      if (results) {
        setSearchResults(JSON.parse(results));
      }
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Fetch bookmarked apps
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("bookmarks")
          .eq("id", session.user.id)
          .single();
          
        if (error) throw error;
        
        if (data && data.bookmarks) {
          setBookmarkedApps(data.bookmarks);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };
    
    fetchBookmarks();
  }, [session?.user]);

  // Apply bookmarks to apps
  const appsWithBookmarks = apps.map(app => ({
    ...app,
    bookmarked: bookmarkedApps.includes(app.id)
  }));

  const filteredApps = (searchQuery ? searchResults : appsWithBookmarks)
    .filter(app => selectedCategory === "All" || app.category === selectedCategory)
    .filter(app => ratingFilter === null || (app.rating && app.rating >= ratingFilter));

  // Apply sorting
  const sortedApps = [...filteredApps].sort((a, b) => {
    switch (sortOption) {
      case "popular":
        return b.downloads - a.downloads;
      case "newest":
        return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
      case "highest-rated":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedApps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApps = sortedApps.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredApps = [...apps].sort(() => 0.5 - Math.random()).slice(0, 10);
  
  const toggleBookmark = async (appId: string) => {
    if (!session?.user) {
      toast.error("Please log in to bookmark agents");
      return;
    }
    
    const isBookmarked = bookmarkedApps.includes(appId);
    const updatedBookmarks = isBookmarked
      ? bookmarkedApps.filter(id => id !== appId)
      : [...bookmarkedApps, appId];
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ bookmarks: updatedBookmarks })
        .eq("id", session.user.id);
        
      if (error) throw error;
      
      setBookmarkedApps(updatedBookmarks);
      toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
    } catch (error) {
      console.error("Error updating bookmarks:", error);
      toast.error("Failed to update bookmarks");
    }
  };

  const filterByRating = (rating: number | null) => {
    setRatingFilter(rating);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <main className="pt-32 md:pt-24 pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold animate-fade-in">
                {searchQuery ? "Search Results" : "Browse Agents"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {searchQuery
                  ? `Showing results for "${searchQuery}"`
                  : "Discover amazing AI applications"}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <SearchBar className="md:w-64" />
              
              <div className="flex gap-2">
                {/* Category filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {categories.map(category => (
                      <DropdownMenuItem 
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setCurrentPage(1);
                        }}
                        className={category === selectedCategory ? "bg-secondary" : ""}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Rating</DropdownMenuLabel>
                    {[4, 3, 0, null].map((rating) => (
                      <DropdownMenuItem 
                        key={rating === null ? "all" : rating}
                        onClick={() => filterByRating(rating)}
                        className={rating === ratingFilter ? "bg-secondary" : ""}
                      >
                        {rating === null ? "All Ratings" : `${rating}+ Stars`}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Sort options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                      <DropdownMenuRadioItem value="popular">Most Popular</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="highest-rated">Highest Rated</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Bookmarked toggle */}
                <Button 
                  variant={selectedCategory === "bookmarked" ? "default" : "outline"} 
                  className="gap-2"
                  onClick={() => {
                    setSelectedCategory(selectedCategory === "bookmarked" ? "All" : "bookmarked");
                    setCurrentPage(1);
                  }}
                >
                  <Bookmark className={`h-4 w-4 ${selectedCategory === "bookmarked" ? "fill-primary-foreground" : ""}`} />
                  {selectedCategory === "bookmarked" ? "All Agents" : "Bookmarked"}
                </Button>
                
                <Button className="w-full md:w-auto gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Agent
                </Button>
              </div>
            </div>
          </div>

          {!searchQuery && !isLoading && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Featured Collections</h2>
              </div>
              <div className="relative">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {featuredApps.map((app) => (
                      <CarouselItem key={app.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <Card className="overflow-hidden border-0 bg-transparent shadow-none hover:shadow-lg transition-all duration-300">
                            <div className="aspect-[4/3] relative rounded-xl overflow-hidden group">
                              <img 
                                src={app.image_url} 
                                alt={app.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80" />
                              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-medium bg-primary/30 backdrop-blur-sm px-2 py-1 rounded-full">
                                    {app.category}
                                  </span>
                                  {app.rating && (
                                    <span className="flex items-center text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                      {app.rating.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-xl font-bold mt-2">{app.name}</h3>
                                <p className="text-sm text-white/80 line-clamp-2 mt-1">{app.description}</p>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-black/50 hover:bg-black/70 text-white border-none" />
                  <CarouselNext className="right-2 bg-black/50 hover:bg-black/70 text-white border-none" />
                </Carousel>
                
                {/* Carousel indicators */}
                <div className="flex justify-center mt-4 gap-1">
                  {[...Array(Math.min(5, Math.ceil(featuredApps.length / 3)))].map((_, i) => (
                    <div
                      key={i}
                      className="h-1 w-6 rounded-full bg-muted transition-colors"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-[400px] rounded-2xl bg-secondary/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Active filters */}
              {(selectedCategory !== "All" || ratingFilter !== null || sortOption !== "popular") && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCategory !== "All" && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Category: {selectedCategory}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 p-0 hover:bg-transparent" 
                        onClick={() => setSelectedCategory("All")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  
                  {ratingFilter !== null && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Rating: {ratingFilter}+ stars
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 p-0 hover:bg-transparent" 
                        onClick={() => setRatingFilter(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  
                  {sortOption !== "popular" && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Sort: {sortOption === "newest" ? "Newest" : "Highest Rated"}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 p-0 hover:bg-transparent" 
                        onClick={() => setSortOption("popular")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => {
                      setSelectedCategory("All");
                      setRatingFilter(null);
                      setSortOption("popular");
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            
              {sortedApps.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedApps.map((app) => (
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
                  
                  {totalPages > 1 && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {[...Array(totalPages)].map((_, i) => {
                          if (
                            i === 0 || 
                            i === totalPages - 1 || 
                            (i >= currentPage - 2 && i <= currentPage + 0)
                          ) {
                            return (
                              <PaginationItem key={i}>
                                <PaginationLink 
                                  isActive={currentPage === i + 1}
                                  onClick={() => handlePageChange(i + 1)}
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          
                          if (
                            (i === 1 && currentPage > 3) || 
                            (i === totalPages - 2 && currentPage < totalPages - 2)
                          ) {
                            return (
                              <PaginationItem key={i}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          
                          return null;
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">
                    {searchQuery
                      ? "No results found for your search"
                      : selectedCategory === "bookmarked"
                      ? "You haven't bookmarked any agents yet"
                      : "No agents match your current filters"}
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
