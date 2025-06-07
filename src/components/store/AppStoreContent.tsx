
import { useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import AppStoreHeader from './AppStoreHeader';
import CategoryGrid from './CategoryGrid';
import FeaturedSection from './FeaturedSection';
import AppCard from './AppCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Zap, Trophy } from 'lucide-react';

const AppStoreContent = () => {
  const { apps, categories, featuredApps, loading } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(apps);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // In a real app, this would be an API call
      const results = apps.filter(app => 
        app.name.toLowerCase().includes(query.toLowerCase()) ||
        app.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setSelectedCategory(null);
    } else {
      setSearchResults([]);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAppClick = (appId: string) => {
    // Navigate to app detail page
    console.log('Navigate to app:', appId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppStoreHeader onSearch={handleSearch} searchQuery={searchQuery} />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Search Results for "{searchQuery}" ({searchResults.length})
            </h2>
            <div className="space-y-3">
              {searchResults.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onClick={handleAppClick}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        )}

        {/* Category Results */}
        {selectedCategory && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {categories.find(c => c.id === selectedCategory)?.name} Apps
            </h2>
            <div className="space-y-3">
              {apps
                .filter(app => app.category === categories.find(c => c.id === selectedCategory)?.name)
                .map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onClick={handleAppClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Default Content */}
        {!searchQuery && !selectedCategory && (
          <>
            <CategoryGrid
              categories={categories}
              onCategoryClick={handleCategoryClick}
            />

            <FeaturedSection
              apps={featuredApps}
              onAppClick={handleAppClick}
            />

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Trending Now
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {apps.slice(0, 3).map((app) => (
                    <AppCard
                      key={app.id}
                      app={app}
                      onClick={handleAppClick}
                      variant="compact"
                    />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    New Releases
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {apps.slice(1, 4).map((app) => (
                    <AppCard
                      key={app.id}
                      app={app}
                      onClick={handleAppClick}
                      variant="compact"
                    />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="h-5 w-5 text-purple-500" />
                    Top Charts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {apps.slice(0, 3).map((app, index) => (
                    <div key={app.id} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <AppCard
                        app={app}
                        onClick={handleAppClick}
                        variant="compact"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppStoreContent;
