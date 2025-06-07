
import { Search, Bell, User, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface AppStoreHeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const AppStoreHeader = ({ onSearch, searchQuery }: AppStoreHeaderProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
            App Store
          </h1>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search apps, games, and more..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="pl-10 pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>
            
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppStoreHeader;
