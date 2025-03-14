
import Navigation from "@/components/Navigation";
import BottomMenu from "@/components/BottomMenu";
import AgentCard from "@/components/AgentCard";
import SearchBar from "@/components/SearchBar";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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

interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  downloads: number;
}

// Sample app data to use if not enough apps are returned from database
const sampleApps: App[] = [
  {
    id: "sample-1",
    name: "Code Assistant Pro",
    description: "Advanced AI for coding help and pair programming. Perfect for developers of all skill levels.",
    category: "Productivity",
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    downloads: 18432
  },
  {
    id: "sample-2",
    name: "Pixel Perfect",
    description: "Generate stunning, high-quality images from text prompts with advanced style controls.",
    category: "Image Generation",
    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    downloads: 24567
  },
  {
    id: "sample-3",
    name: "Data Wizard",
    description: "Analyze complex datasets and create beautiful visualizations with simple prompts.",
    category: "Data Analysis",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    downloads: 12890
  },
  {
    id: "sample-4",
    name: "Story Weaver",
    description: "Create immersive stories, characters, and dialogue for your next creative project.",
    category: "Entertainment",
    image_url: "https://images.unsplash.com/photo-1468273519810-8bbe53d3c9a0?q=80&w=2052&auto=format&fit=crop",
    downloads: 9876
  },
  {
    id: "sample-5",
    name: "ChatMaster",
    description: "Advanced conversational AI that remembers context and adapts to your communication style.",
    category: "Chatbots",
    image_url: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=2074&auto=format&fit=crop",
    downloads: 31452
  },
  {
    id: "sample-6",
    name: "Presentation Pro",
    description: "Generate beautiful slide decks and presentations with simple text prompts.",
    category: "Productivity",
    image_url: "https://images.unsplash.com/photo-1607970669494-54652c9e579c?q=80&w=2070&auto=format&fit=crop",
    downloads: 8745
  },
  {
    id: "sample-7",
    name: "Dream Canvas",
    description: "Turn your imagination into beautiful artwork with this AI-powered painting assistant.",
    category: "Image Generation",
    image_url: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=2009&auto=format&fit=crop",
    downloads: 15789
  },
  {
    id: "sample-8",
    name: "Marketing Genius",
    description: "Create compelling marketing copy, slogans, and campaign ideas for your business.",
    category: "Productivity",
    image_url: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=2070&auto=format&fit=crop",
    downloads: 7854
  },
  {
    id: "sample-9",
    name: "MusicMind",
    description: "Generate original music compositions and melodies based on your mood and preferences.",
    category: "Entertainment",
    image_url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop",
    downloads: 13456
  }
];

const categories = ["All", "Chatbots", "Image Generation", "Data Analysis", "Productivity", "Entertainment"];

const Apps = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  const [searchResults, setSearchResults] = useState<App[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('downloads', { ascending: false });
      
      if (error) throw error;
      
      // If we have less than 3 apps, add sample apps to make the UI more interesting
      if (!data || data.length < 3) {
        return sampleApps;
      }
      
      return data || [];
    },
  });

  useEffect(() => {
    // If there's a search query, get results from localStorage
    if (searchQuery) {
      const results = localStorage.getItem("searchResults");
      if (results) {
        setSearchResults(JSON.parse(results));
      }
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Filter apps by selected category
  const filteredApps = selectedCategory === "All" 
    ? (searchQuery ? searchResults : apps)
    : (searchQuery ? searchResults : apps).filter(app => app.category === selectedCategory);

  // Calculate pagination
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApps = filteredApps.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                          setCurrentPage(1); // Reset to first page when changing category
                        }}
                        className={category === selectedCategory ? "bg-secondary" : ""}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button className="w-full md:w-auto gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Agent
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-[400px] rounded-2xl bg-secondary/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {filteredApps.length > 0 ? (
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
                  
                  {/* Pagination */}
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
                          // Show first page, last page, and pages around current page
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
                          
                          // Show ellipsis if there's a gap
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
                      : "No apps available yet."}
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
