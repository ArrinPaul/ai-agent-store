
import { useState, useEffect } from 'react';
import { App, Review, Category, AppCollection } from '@/types/app';

// Mock data - in real app this would come from Supabase
const mockCategories: Category[] = [
  { id: '1', name: 'Productivity', icon: '📊', color: 'bg-blue-500', app_count: 1247 },
  { id: '2', name: 'Entertainment', icon: '🎮', color: 'bg-purple-500', app_count: 3421 },
  { id: '3', name: 'Education', icon: '📚', color: 'bg-green-500', app_count: 892 },
  { id: '4', name: 'Health & Fitness', icon: '💪', color: 'bg-red-500', app_count: 654 },
  { id: '5', name: 'Finance', icon: '💰', color: 'bg-yellow-500', app_count: 432 },
  { id: '6', name: 'Social', icon: '👥', color: 'bg-pink-500', app_count: 289 },
  { id: '7', name: 'Travel', icon: '✈️', color: 'bg-indigo-500', app_count: 345 },
  { id: '8', name: 'Photo & Video', icon: '📸', color: 'bg-orange-500', app_count: 567 },
];

const mockApps: App[] = [
  {
    id: '1',
    name: 'TaskMaster Pro',
    description: 'Ultimate productivity app with AI-powered task management, calendar integration, and team collaboration features.',
    short_description: 'AI-powered task management',
    icon_url: '/placeholder.svg',
    screenshots: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    category: 'Productivity',
    developer_id: '1',
    developer_name: 'ProductiveTech Inc.',
    version: '2.1.4',
    size: '45.2 MB',
    rating: 4.8,
    review_count: 12847,
    download_count: 500000,
    price: 9.99,
    is_free: false,
    is_featured: true,
    is_editors_choice: true,
    tags: ['productivity', 'ai', 'tasks', 'calendar'],
    compatibility: ['iOS 14.0+', 'Android 8.0+'],
    languages: ['English', 'Spanish', 'French'],
    age_rating: '4+',
    content_rating: 'Everyone',
    release_date: '2023-01-15',
    last_updated: '2024-12-01',
    whats_new: 'New AI assistant, improved performance, bug fixes',
    permissions: ['Calendar', 'Notifications', 'Camera'],
    status: 'published',
    created_at: '2023-01-15',
    updated_at: '2024-12-01'
  },
  {
    id: '2',
    name: 'FitTrack Elite',
    description: 'Comprehensive fitness tracking with workout plans, nutrition guidance, and progress analytics.',
    short_description: 'Complete fitness companion',
    icon_url: '/placeholder.svg',
    screenshots: ['/placeholder.svg', '/placeholder.svg'],
    category: 'Health & Fitness',
    developer_id: '2',
    developer_name: 'FitTech Solutions',
    version: '1.8.2',
    size: '67.8 MB',
    rating: 4.6,
    review_count: 8932,
    download_count: 250000,
    price: 0,
    is_free: true,
    is_featured: false,
    is_editors_choice: false,
    tags: ['fitness', 'health', 'workout', 'nutrition'],
    compatibility: ['iOS 13.0+', 'Android 7.0+'],
    languages: ['English', 'German'],
    age_rating: '12+',
    content_rating: 'Everyone',
    release_date: '2023-06-20',
    last_updated: '2024-11-15',
    whats_new: 'New workout plans, improved UI',
    permissions: ['HealthKit', 'Location', 'Camera'],
    status: 'published',
    created_at: '2023-06-20',
    updated_at: '2024-11-15'
  }
];

export const useAppStore = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredApps, setFeaturedApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApps(mockApps);
      setCategories(mockCategories);
      setFeaturedApps(mockApps.filter(app => app.is_featured));
      setLoading(false);
    }, 1000);
  }, []);

  const searchApps = (query: string) => {
    return apps.filter(app => 
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      app.description.toLowerCase().includes(query.toLowerCase()) ||
      app.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getAppsByCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return apps.filter(app => app.category === category?.name);
  };

  const getAppDetails = (appId: string) => {
    return apps.find(app => app.id === appId);
  };

  return {
    apps,
    categories,
    featuredApps,
    loading,
    searchApps,
    getAppsByCategory,
    getAppDetails
  };
};
