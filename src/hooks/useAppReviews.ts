
import { useState, useEffect } from 'react';

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
        // Mock reviews for now
        const mockReviews: AppReview[] = [
          {
            id: "1",
            app_id: appId,
            user_id: "user1",
            user_name: "John Doe",
            rating: 5,
            content: "Great app!",
            helpful_count: 10,
            is_verified_purchase: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setReviews(mockReviews);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [appId]);

  const addReview = async (rating: number, title?: string, content?: string) => {
    // Enhanced validation
    if (!validateRating(rating)) {
      return { success: false, error: 'Rating must be between 1 and 5' };
    }

    if (content && !validateReviewContent(content)) {
      return { success: false, error: 'Review content is invalid or too short/long' };
    }

    if (title && title.length > 100) {
      return { success: false, error: 'Review title is too long' };
    }

    try {
      // Add review to mock reviews
      const newReview: AppReview = {
        id: Date.now().toString(),
        app_id: appId,
        user_id: "current-user",
        user_name: "Current User",
        rating,
        title,
        content: content || '',
        helpful_count: 0,
        is_verified_purchase: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setReviews(prev => [newReview, ...prev]);
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
