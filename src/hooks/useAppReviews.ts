
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
          // Map the database schema to our AppReview interface
          const mappedReviews: AppReview[] = (data || []).map(review => ({
            id: review.id,
            app_id: review.app_id || '',
            user_id: review.user_id || '',
            user_name: 'Anonymous User', // Default since not in current schema
            user_avatar: undefined,
            rating: review.rating || 0,
            title: undefined,
            content: review.comment || '',
            helpful_count: review.helpful_count || 0,
            is_verified_purchase: false, // Default since not in current schema
            developer_response: undefined,
            developer_response_date: undefined,
            created_at: review.created_at || new Date().toISOString(),
            updated_at: review.updated_at || review.created_at || new Date().toISOString()
          }));
          setReviews(mappedReviews);
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
    if (!user) {
      console.log('User not authenticated');
      return false;
    }

    try {
      const { error } = await supabase
        .from('app_reviews')
        .insert([{
          app_id: appId,
          user_id: user.id,
          rating,
          comment: content || '' // Map content to comment field
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

      if (data) {
        const mappedReviews: AppReview[] = data.map(review => ({
          id: review.id,
          app_id: review.app_id || '',
          user_id: review.user_id || '',
          user_name: 'Anonymous User',
          user_avatar: undefined,
          rating: review.rating || 0,
          title: undefined,
          content: review.comment || '',
          helpful_count: review.helpful_count || 0,
          is_verified_purchase: false,
          developer_response: undefined,
          developer_response_date: undefined,
          created_at: review.created_at || new Date().toISOString(),
          updated_at: review.updated_at || review.created_at || new Date().toISOString()
        }));
        setReviews(mappedReviews);
      }
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
