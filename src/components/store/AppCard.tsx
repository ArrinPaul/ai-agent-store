
import { App } from '@/types/app';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Download, Clock, Shield, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import { toast } from 'sonner';

interface AppCardProps {
  app: App;
  onClick: (appId: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

const AppCard = ({ app, onClick, variant = 'default' }: AppCardProps) => {
  const { downloadApp, addToFavorites } = useAppStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      await downloadApp(app.id);
      toast.success(`${app.name} downloaded successfully!`);
    } catch (error) {
      toast.error('Failed to download app');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addToFavorites(app.id);
      toast.success('Added to favorites!');
    } catch (error) {
      toast.error('Failed to add to favorites');
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick(app.id)}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <img
              src={app.icon_url}
              alt={app.name}
              className="w-10 h-10 rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate text-sm">{app.name}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {app.developer_name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{app.rating}</span>
                </div>
                <span className="text-xs font-medium text-primary">
                  {app.is_free ? 'Free' : `$${app.price}`}
                </span>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? 'Installing...' : app.is_free ? 'Get' : 'Buy'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onClick(app.id)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <img
            src={app.icon_url}
            alt={app.name}
            className="w-16 h-16 rounded-xl"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate">{app.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {app.developer_name}
                </p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {app.short_description}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="font-semibold text-lg text-primary">
                  {app.is_free ? 'Free' : `$${app.price}`}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleFavorite}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    {isDownloading ? 'Installing...' : app.is_free ? 'Install' : 'Buy'}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{app.rating}</span>
                <span>({app.review_count.toLocaleString()})</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{(app.download_count / 1000).toFixed(0)}K+</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Updated {new Date(app.last_updated).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary">{app.category}</Badge>
              {app.is_editors_choice && (
                <Badge className="bg-yellow-500">Editor's Choice</Badge>
              )}
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {app.age_rating}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppCard;
