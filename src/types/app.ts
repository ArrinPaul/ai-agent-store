
export interface App {
  id: string;
  name: string;
  description: string;
  short_description: string;
  icon_url: string;
  screenshots: string[];
  video_url?: string;
  category: string;
  subcategory?: string;
  developer_id: string;
  developer_name: string;
  version: string;
  size: string;
  rating: number;
  review_count: number;
  download_count: number;
  price: number;
  is_free: boolean;
  is_featured: boolean;
  is_editors_choice: boolean;
  tags: string[];
  compatibility: string[];
  languages: string[];
  age_rating: string;
  content_rating: string;
  privacy_policy_url?: string;
  support_url?: string;
  website_url?: string;
  release_date: string;
  last_updated: string;
  whats_new: string;
  permissions: string[];
  status: 'published' | 'pending' | 'rejected' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  app_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  title: string;
  content: string;
  helpful_count: number;
  is_verified_purchase: boolean;
  developer_response?: string;
  developer_response_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  app_count: number;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
  app_count: number;
}

export interface AppCollection {
  id: string;
  title: string;
  description: string;
  apps: App[];
  type: 'featured' | 'new' | 'trending' | 'editors_choice' | 'custom';
}
