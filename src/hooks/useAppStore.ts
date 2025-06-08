
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { App, Category } from '@/types/app';

export const useAppStore = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock categories since the table doesn't exist yet
  const mockCategories: Category[] = [
    { id: 'photography', name: 'Photography', icon: '📸', color: 'bg-blue-100 text-blue-600', app_count: 0 },
    { id: 'health', name: 'Health & Fitness', icon: '💪', color: 'bg-green-100 text-green-600', app_count: 0 },
    { id: 'weather', name: 'Weather', icon: '🌤️', color: 'bg-yellow-100 text-yellow-600', app_count: 0 },
    { id: 'games', name: 'Games', icon: '🎮', color: 'bg-purple-100 text-purple-600', app_count: 0 },
    { id: 'productivity', name: 'Productivity', icon: '📊', color: 'bg-indigo-100 text-indigo-600', app_count: 0 },
    { id: 'social', name: 'Social', icon: '👥', color: 'bg-pink-100 text-pink-600', app_count: 0 },
    { id: 'music', name: 'Music', icon: '🎵', color: 'bg-red-100 text-red-600', app_count: 0 },
    { id: 'education', name: 'Education', icon: '🎓', color: 'bg-teal-100 text-teal-600', app_count: 0 }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Set mock categories
        setCategories(mockCategories);

        // Fetch apps from the existing apps table
        const { data: appsData, error: appsError } = await supabase
          .from('apps')
          .select('*')
          .order('created_at', { ascending: false });

        if (appsError) {
          console.error('Error loading apps:', appsError);
        } else if (appsData) {
          // Map the existing database schema to our App interface
          const mappedApps: App[] = appsData.map(app => ({
            id: app.id,
            name: app.name,
            description: app.description || '',
            short_description: app.description || '', // Use description as short_description
            icon_url: app.image_url || '/placeholder.svg', // Map image_url to icon_url
            screenshots: [app.image_url || '/placeholder.svg'], // Use image_url as screenshot
            video_url: undefined,
            category: app.category || 'other',
            subcategory: undefined,
            developer_id: app.creator_id || '',
            developer_name: 'Developer', // Default name since not in schema
            version: '1.0.0',
            size: '10 MB',
            rating: Number(app.rating) || 0,
            review_count: 0, // Default since not in schema
            download_count: app.downloads || 0,
            price: 0,
            is_free: true,
            is_featured: app.featured || false,
            is_editors_choice: false,
            tags: [],
            compatibility: ['Web'],
            languages: ['English'],
            age_rating: '4+',
            content_rating: 'Everyone',
            privacy_policy_url: undefined,
            support_url: undefined,
            website_url: undefined,
            release_date: app.created_at || new Date().toISOString(),
            last_updated: app.updated_at || app.created_at || new Date().toISOString(),
            whats_new: 'Latest update',
            permissions: [],
            status: 'published' as const,
            created_at: app.created_at || new Date().toISOString(),
            updated_at: app.updated_at || app.created_at || new Date().toISOString()
          }));
          setApps(mappedApps);
        }
      } catch (error) {
        console.error('Error loading app store data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const featuredApps = apps.filter(app => app.is_featured);

  const addToFavorites = async (appId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    try {
      // For now, just log since user_favorites table doesn't exist
      console.log('Would add to favorites:', appId);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (appId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    try {
      // For now, just log since user_favorites table doesn't exist
      console.log('Would remove from favorites:', appId);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const downloadApp = async (appId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    try {
      // Update download count in the existing apps table
      const app = apps.find(a => a.id === appId);
      if (app) {
        await supabase
          .from('apps')
          .update({ downloads: (app.download_count || 0) + 1 })
          .eq('id', appId);

        // Update local state
        setApps(prev => prev.map(a => 
          a.id === appId 
            ? { ...a, download_count: (a.download_count || 0) + 1 }
            : a
        ));
      }
    } catch (error) {
      console.error('Error downloading app:', error);
    }
  };

  return {
    apps,
    categories,
    featuredApps,
    loading,
    addToFavorites,
    removeFromFavorites,
    downloadApp
  };
};
