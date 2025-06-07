
import { App } from '@/types/app';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Download, Award } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface FeaturedSectionProps {
  apps: App[];
  onAppClick: (appId: string) => void;
}

const FeaturedSection = ({ apps, onAppClick }: FeaturedSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Award className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-semibold">Featured Apps</h2>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {apps.map((app) => (
            <CarouselItem key={app.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-blue-600/20 relative">
                  <img
                    src={app.screenshots[0] || '/placeholder.svg'}
                    alt={app.name}
                    className="w-full h-full object-cover"
                  />
                  {app.is_editors_choice && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      Editor's Choice
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
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
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{app.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          <span>{(app.download_count / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-semibold text-primary">
                      {app.is_free ? 'Free' : `$${app.price}`}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => onAppClick(app.id)}
                    >
                      {app.is_free ? 'Install' : 'Buy'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default FeaturedSection;
