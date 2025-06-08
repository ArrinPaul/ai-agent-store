
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/hooks/useAppStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, TrendingUp, Star, Download } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { session, user } = useAuth();
  const { featuredApps, loading } = useAppStore();

  const handleExploreApps = () => {
    navigate("/apps");
  };

  const handleAuthRedirect = () => {
    navigate("/auth");
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-blue-600/20 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <Store className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
              AI Agent Store
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover, download, and enjoy thousands of amazing apps
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleAuthRedirect}>
              Get Started
            </Button>
            <Button variant="outline" size="lg" onClick={handleExploreApps}>
              Browse Apps
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Discover amazing apps tailored just for you
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleExploreApps}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Browse Store
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore thousands of apps across all categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                See what's popular and trending today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Top Rated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Discover the highest rated apps by users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Apps Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Featured Apps</h2>
            <Button variant="outline" onClick={handleExploreApps}>
              View All
            </Button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredApps.slice(0, 3).map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.icon_url}
                        alt={app.name}
                        className="w-12 h-12 rounded-xl"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{app.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {app.developer_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{app.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span className="text-xs">{(app.download_count / 1000).toFixed(0)}K</span>
                          </div>
                          {app.is_editors_choice && (
                            <Badge variant="secondary" className="text-xs">
                              Editor's Choice
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
