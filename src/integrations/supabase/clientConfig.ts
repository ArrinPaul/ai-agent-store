
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bxzocrxosemttrtdagtm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4em9jcnhvc2VtdHRydGRhZ3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNzc0MjMsImV4cCI6MjA1NDc1MzQyM30.WbIeMwbV19uEGaQ75-8SUo74qVAfXdKCqkCeIzLpB4E";

// Configure Supabase client with explicit auth settings
export const createSupabaseClient = () => {
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    }
  });
};
