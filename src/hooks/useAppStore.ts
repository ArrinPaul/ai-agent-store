
import { useState, useEffect } from 'react';
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

        // Mock apps for now
        const mockApps: App[] = [
          {
            id: "1",
            name: "AI Assistant Pro",
            description: "Advanced AI assistant for professional workflows",
            short_description: "Professional AI assistant",
            icon_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
            screenshots: ["https://images.unsplash.com/photo-1677442136019-21780ecad995"],
            category: "productivity",
            developer_id: "dev1",
            developer_name: "AI Corp",
            version: "1.0.0",
            size: "10 MB",
            rating: 4.8,
            review_count: 120,
            download_count: 5420,
            price: 0,
            is_free: true,
            is_featured: true,
            is_editors_choice: false,
            tags: ["ai", "productivity"],
            compatibility: ["Web"],
            languages: ["English"],
            age_rating: "4+",
            content_rating: "Everyone",
            release_date: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            whats_new: "Latest update",
            permissions: [],
            status: "published" as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setApps(mockApps);
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
    console.log('Would add to favorites:', appId);
  };

  const removeFromFavorites = async (appId: string) => {
    console.log('Would remove from favorites:', appId);
  };

  const downloadApp = async (appId: string) => {
    // Update local state
    setApps(prev => prev.map(a => 
      a.id === appId 
        ? { ...a, download_count: (a.download_count || 0) + 1 }
        : a
    ));
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
