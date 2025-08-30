
import { motion } from "framer-motion";
import { User, Settings, Star, Bookmark, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  // Mock user data for demo purposes
  const mockUser = {
    username: "Demo User",
    avatar_url: null,
    created_at: new Date().toISOString(),
    favorites: [],
    bookmarks: []
  };

  const stats = [
    { icon: Download, label: "Downloads", value: "0", color: "text-blue-500" },
    { icon: Star, label: "Favorites", value: "0", color: "text-yellow-500" },
    { icon: Bookmark, label: "Bookmarks", value: "0", color: "text-green-500" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Profile Header */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={mockUser.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h1 className="text-3xl font-bold">{mockUser.username || "Demo User"}</h1>
                  <Badge variant="secondary" className="w-fit">
                    Demo Mode
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Member since {new Date(mockUser.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center space-y-2">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is a demo version of the profile page. In a full implementation, 
              this would show your actual user data, favorites, and bookmarks.
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  No recent activity in demo mode
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
