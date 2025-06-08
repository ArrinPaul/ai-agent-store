
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AppReview {
  id: string;
  app_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  title?: string;
  content?: string;
  helpful_count: number;
  is_verified_purchase: boolean;
  developer_response?: string;
  developer_response_date?: string;
  created_at: string;
  updated_at: string;
}

export const useAppReviews = (appId: string) => {
  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('app_reviews')
          .select('*')
          .eq('app_id', appId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading reviews:', error);
        } else {
          setReviews(data || []);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (appId) {
      loadReviews();
    }
  }, [appId]);

  const addReview = async (rating: number, title?: string, content?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('app_reviews')
        .insert([{
          app_id: appId,
          user_id: user.id,
          user_name: user.email?.split('@')[0] || 'Anonymous',
          rating,
          title,
          content
        }]);

      if (error) {
        console.error('Error adding review:', error);
        return false;
      }

      // Refresh reviews
      const { data } = await supabase
        .from('app_reviews')
        .select('*')
        .eq('app_id', appId)
        .order('created_at', { ascending: false });

      setReviews(data || []);
      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    }
  };

  return {
    reviews,
    loading,
    addReview
  };
};
