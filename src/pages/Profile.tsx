
import Navigation from "@/components/Navigation";
import BottomMenu from "@/components/BottomMenu";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import AgentCard from "@/components/AgentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { session } = useAuth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Fetch user's favorite apps
  const { data: favoriteApps = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ['favoriteApps', profile?.favorites],
    queryFn: async () => {
      if (!profile?.favorites) return [];
      
      const favoritesArray = profile.favorites as string[] || [];
      if (favoritesArray.length === 0) return [];
      
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .in('id', favoritesArray);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.favorites && Array.isArray(profile.favorites) && (profile.favorites as string[]).length > 0,
  });

  // Fetch user's uploaded apps
  const { data: userApps = [], isLoading: userAppsLoading } = useQuery({
    queryKey: ['userApps', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .eq('creator_id', userId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8 animate-fade-in">
          <div className="glass-effect rounded-xl p-8">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {profileLoading ? (
                      <Skeleton className="h-7 w-48" />
                    ) : (
                      profile?.username || "User"
                    )}
                  </h2>
                  <p className="text-muted-foreground">{userEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 rounded-lg bg-secondary/20">
                  <h3 className="text-lg font-semibold mb-2">My Downloads</h3>
                  <p className="text-3xl font-bold text-primary">
                    {profileLoading ? <Skeleton className="h-10 w-16 inline-block" /> : "0"}
                  </p>
                </div>
                <div className="p-6 rounded-lg bg-secondary/20">
                  <h3 className="text-lg font-semibold mb-2">My Uploads</h3>
                  <p className="text-3xl font-bold text-primary">
                    {userAppsLoading ? <Skeleton className="h-10 w-16 inline-block" /> : userApps.length}
                  </p>
                </div>
              </div>
              
              <Tabs defaultValue="favorites" className="mt-10">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="uploads">My Uploads</TabsTrigger>
                </TabsList>
                
                <TabsContent value="favorites" className="mt-6">
                  {favoritesLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[1, 2].map((n) => (
                        <div key={n} className="h-[300px] rounded-2xl bg-secondary/50 animate-pulse" />
                      ))}
                    </div>
                  ) : favoriteApps.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {favoriteApps.map((app) => (
                        <AgentCard
                          key={app.id}
                          id={app.id}
                          name={app.name}
                          description={app.description}
                          category={app.category || "Other"}
                          image_url={app.image_url || "/placeholder.svg"}
                          downloads={app.downloads}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">You haven't favorited any agents yet.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="uploads" className="mt-6">
                  {userAppsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[1, 2].map((n) => (
                        <div key={n} className="h-[300px] rounded-2xl bg-secondary/50 animate-pulse" />
                      ))}
                    </div>
                  ) : userApps.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {userApps.map((app) => (
                        <AgentCard
                          key={app.id}
                          id={app.id}
                          name={app.name}
                          description={app.description}
                          category={app.category || "Other"}
                          image_url={app.image_url || "/placeholder.svg"}
                          downloads={app.downloads}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">You haven't uploaded any agents yet.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <BottomMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default Profile;
