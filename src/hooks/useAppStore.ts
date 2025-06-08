
import { useState, useEffect } from 'react';
import { App, Category } from '@/types/app';

// Mock data for development - in a real app this would come from an API
const mockApps: App[] = [
  {
    id: '1',
    name: 'PhotoEditor Pro',
    description: 'Professional photo editing with advanced filters and tools',
    short_description: 'Edit photos like a pro',
    icon_url: '/placeholder.svg',
    screenshots: ['/placeholder.svg', '/placeholder.svg'],
    category: 'Photography',
    developer_id: 'dev1',
    developer_name: 'Creative Studios',
    version: '2.1.0',
    size: '45.2 MB',
    rating: 4.5,
    review_count: 12500,
    download_count: 150000,
    price: 0,
    is_free: true,
    is_featured: true,
    is_editors_choice: true,
    tags: ['photo', 'editing', 'filters'],
    compatibility: ['iOS 14+', 'Android 8+'],
    languages: ['English', 'Spanish', 'French'],
    age_rating: '4+',
    content_rating: 'Everyone',
    release_date: '2023-01-15',
    last_updated: '2024-06-01',
    whats_new: 'Bug fixes and performance improvements',
    permissions: ['Camera', 'Photo Library'],
    status: 'published',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-06-01T14:30:00Z'
  },
  {
    id: '2',
    name: 'Fitness Tracker',
    description: 'Track your workouts, calories, and fitness goals',
    short_description: 'Your personal fitness companion',
    icon_url: '/placeholder.svg',
    screenshots: ['/placeholder.svg'],
    category: 'Health & Fitness',
    developer_id: 'dev2',
    developer_name: 'Health Apps Inc',
    version: '1.5.2',
    size: '32.1 MB',
    rating: 4.2,
    review_count: 8900,
    download_count: 95000,
    price: 2.99,
    is_free: false,
    is_featured: true,
    is_editors_choice: false,
    tags: ['fitness', 'health', 'tracking'],
    compatibility: ['iOS 13+', 'Android 7+'],
    languages: ['English'],
    age_rating: '4+',
    content_rating: 'Everyone',
    release_date: '2023-03-20',
    last_updated: '2024-05-15',
    whats_new: 'New workout templates added',
    permissions: ['Health Data', 'Location'],
    status: 'published',
    created_at: '2023-03-20T09:00:00Z',
    updated_at: '2024-05-15T11:20:00Z'
  },
  {
    id: '3',
    name: 'Weather Plus',
    description: 'Accurate weather forecasts with beautiful animations',
    short_description: 'Beautiful weather app',
    icon_url: '/placeholder.svg',
    screenshots: ['/placeholder.svg'],
    category: 'Weather',
    developer_id: 'dev3',
    developer_name: 'Weather Co',
    version: '3.0.1',
    size: '28.5 MB',
    rating: 4.7,
    review_count: 25000,
    download_count: 300000,
    price: 0,
    is_free: true,
    is_featured: false,
    is_editors_choice: true,
    tags: ['weather', 'forecast', 'radar'],
    compatibility: ['iOS 15+', 'Android 9+'],
    languages: ['English', 'German', 'Japanese'],
    age_rating: '4+',
    content_rating: 'Everyone',
    release_date: '2022-09-10',
    last_updated: '2024-06-05',
    whats_new: 'Improved radar accuracy',
    permissions: ['Location'],
    status: 'published',
    created_at: '2022-09-10T08:00:00Z',
    updated_at: '2024-06-05T16:45:00Z'
  }
];

const mockCategories: Category[] = [
  {
    id: 'photo',
    name: 'Photography',
    icon: '📸',
    color: 'bg-blue-100 text-blue-600',
    app_count: 1250
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    icon: '💪',
    color: 'bg-green-100 text-green-600',
    app_count: 890
  },
  {
    id: 'weather',
    name: 'Weather',
    icon: '🌤️',
    color: 'bg-yellow-100 text-yellow-600',
    app_count: 234
  },
  {
    id: 'games',
    name: 'Games',
    icon: '🎮',
    color: 'bg-purple-100 text-purple-600',
    app_count: 5670
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: '📊',
    color: 'bg-indigo-100 text-indigo-600',
    app_count: 1890
  },
  {
    id: 'social',
    name: 'Social',
    icon: '👥',
    color: 'bg-pink-100 text-pink-600',
    app_count: 567
  },
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    color: 'bg-red-100 text-red-600',
    app_count: 1100
  },
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    color: 'bg-teal-100 text-teal-600',
    app_count: 2340
  }
];

export const useAppStore = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      try {
        setLoading(true);
        // In a real app, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        setApps(mockApps);
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error loading app store data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const featuredApps = apps.filter(app => app.is_featured);

  return {
    apps,
    categories,
    featuredApps,
    loading
  };
};
