
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  full_name: string | null;
  website: string | null;
  bio: string | null;
  updated_at: string | null;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { session, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      setProfile(data || null);
    } catch (error: any) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch profile when the user changes
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user?.id]);

  // Listen for profile changes with realtime
  useEffect(() => {
    if (!user?.id) return;
    
    const profileSubscription = supabase
      .channel('public:profiles')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, 
        (payload) => {
          setProfile(payload.new as UserProfile);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, [user?.id]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('User must be logged in to update profile');
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
      await fetchProfile();
    } catch (error: any) {
      toast.error(`Error updating profile: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <UserProfileContext.Provider value={{ profile, isLoading, updateProfile, refreshProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
