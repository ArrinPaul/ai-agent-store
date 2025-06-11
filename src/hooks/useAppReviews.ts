
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput } from '@/services/authService';

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

// Enhanced validation for review content
const validateReviewContent = (content: string): boolean => {
  if (!content || content.trim().length < 3) return false;
  if (content.length > 1000) return false;
  
  // Check for XSS patterns
  if (content.includes('<script') || content.includes('javascript:')) return false;
  
  return true;
};

const validateRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
};

export const useAppReviews = (appId: string) => {
  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      if (!appId) return;
      
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

    loadReviews();
  }, [appId]);

  const addReview = async (rating: number, title?: string, content?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    // Enhanced validation
    if (!validateRating(rating)) {
      return { success: false, error: 'Rating must be between 1 and 5' };
    }

    const sanitizedContent = content ? sanitizeInput(content) : '';
    const sanitizedTitle = title ? sanitizeInput(title) : '';

    if (sanitizedContent && !validateReviewContent(sanitizedContent)) {
      return { success: false, error: 'Review content is invalid or too short/long' };
    }

    if (sanitizedTitle && sanitizedTitle.length > 100) {
      return { success: false, error: 'Review title is too long' };
    }

    try {
      const { error } = await supabase
        .from('app_reviews')
        .insert([{
          app_id: appId,
          user_id: user.id,
          rating,
          comment: sanitizedContent || '' // Map content to comment field
        }]);

      if (error) {
        console.error('Error adding review:', error);
        return { success: false, error: 'Failed to add review' };
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
      return { success: true };
    } catch (error) {
      console.error('Error adding review:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  return {
    reviews,
    loading,
    addReview
  };
};
