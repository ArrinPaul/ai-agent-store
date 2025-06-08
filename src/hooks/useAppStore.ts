
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { App, Category } from '@/types/app';

export const useAppStore = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories from Supabase
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (categoriesError) {
          console.error('Error loading categories:', categoriesError);
        } else if (categoriesData) {
          const mappedCategories: Category[] = categoriesData.map(cat => ({
            id: cat.id,
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
            app_count: cat.app_count || 0
          }));
          setCategories(mappedCategories);
        }

        // Fetch apps from Supabase
        const { data: appsData, error: appsError } = await supabase
          .from('apps')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (appsError) {
          console.error('Error loading apps:', appsError);
        } else if (appsData) {
          const mappedApps: App[] = appsData.map(app => ({
            id: app.id,
            name: app.name,
            description: app.description || '',
            short_description: app.short_description || '',
            icon_url: app.icon_url || '/placeholder.svg',
            screenshots: app.screenshots || [],
            video_url: app.video_url,
            category: app.category || '',
            subcategory: app.subcategory,
            developer_id: app.developer_id || '',
            developer_name: app.developer_name,
            version: app.version || '1.0.0',
            size: app.size || '0 MB',
            rating: Number(app.rating) || 0,
            review_count: app.review_count || 0,
            download_count: app.download_count || 0,
            price: Number(app.price) || 0,
            is_free: app.is_free ?? true,
            is_featured: app.is_featured ?? false,
            is_editors_choice: app.is_editors_choice ?? false,
            tags: app.tags || [],
            compatibility: app.compatibility || [],
            languages: app.languages || ['English'],
            age_rating: app.age_rating || '4+',
            content_rating: app.content_rating || 'Everyone',
            privacy_policy_url: app.privacy_policy_url,
            support_url: app.support_url,
            website_url: app.website_url,
            release_date: app.release_date || app.created_at,
            last_updated: app.last_updated || app.updated_at,
            whats_new: app.whats_new || 'Initial release',
            permissions: app.permissions || [],
            status: app.status as 'published' | 'pending' | 'rejected' | 'draft',
            created_at: app.created_at,
            updated_at: app.updated_at
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
    if (!user) return;

    try {
      await supabase
        .from('user_favorites')
        .insert([{ user_id: user.id, app_id: appId }]);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (appId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('app_id', appId);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const downloadApp = async (appId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Add to downloads
      await supabase
        .from('user_downloads')
        .insert([{ user_id: user.id, app_id: appId }]);

      // Update download count
      const { data: app } = await supabase
        .from('apps')
        .select('download_count')
        .eq('id', appId)
        .single();

      if (app) {
        await supabase
          .from('apps')
          .update({ download_count: (app.download_count || 0) + 1 })
          .eq('id', appId);
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
