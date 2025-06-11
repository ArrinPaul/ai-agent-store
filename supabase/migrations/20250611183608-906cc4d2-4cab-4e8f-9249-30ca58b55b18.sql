
-- Fix 1: Add RLS policies for login_attempts table (if they don't exist)
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Check and create login_attempts policies only if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'login_attempts' 
        AND policyname = 'Users can view own login attempts'
    ) THEN
        CREATE POLICY "Users can view own login attempts" 
          ON public.login_attempts 
          FOR SELECT 
          USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'login_attempts' 
        AND policyname = 'Users can insert own login attempts'
    ) THEN
        CREATE POLICY "Users can insert own login attempts" 
          ON public.login_attempts 
          FOR INSERT 
          WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'login_attempts' 
        AND policyname = 'Users can update own login attempts'
    ) THEN
        CREATE POLICY "Users can update own login attempts" 
          ON public.login_attempts 
          FOR UPDATE 
          USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
    END IF;
END $$;

-- Fix 2: Add RLS policies for apps table (if they don't exist)
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'apps' 
        AND policyname = 'Anyone can view apps'
    ) THEN
        CREATE POLICY "Anyone can view apps" 
          ON public.apps 
          FOR SELECT 
          USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'apps' 
        AND policyname = 'Users can create apps'
    ) THEN
        CREATE POLICY "Users can create apps" 
          ON public.apps 
          FOR INSERT 
          WITH CHECK (auth.uid() = creator_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'apps' 
        AND policyname = 'Users can update own apps'
    ) THEN
        CREATE POLICY "Users can update own apps" 
          ON public.apps 
          FOR UPDATE 
          USING (auth.uid() = creator_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'apps' 
        AND policyname = 'Users can delete own apps'
    ) THEN
        CREATE POLICY "Users can delete own apps" 
          ON public.apps 
          FOR DELETE 
          USING (auth.uid() = creator_id);
    END IF;
END $$;

-- Fix 3: Add RLS policies for profiles table (if they don't exist)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Users can view own profile'
    ) THEN
        CREATE POLICY "Users can view own profile" 
          ON public.profiles 
          FOR SELECT 
          USING (auth.uid() = id);
    END IF;

    -- Skip "Users can update own profile" since it already exists

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Authenticated users can view basic profile info'
    ) THEN
        CREATE POLICY "Authenticated users can view basic profile info" 
          ON public.profiles 
          FOR SELECT 
          TO authenticated
          USING (true);
    END IF;
END $$;

-- Fix 4: Add RLS policies for app_reviews table (if they don't exist)
ALTER TABLE public.app_reviews ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'app_reviews' 
        AND policyname = 'Anyone can view reviews'
    ) THEN
        CREATE POLICY "Anyone can view reviews" 
          ON public.app_reviews 
          FOR SELECT 
          USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'app_reviews' 
        AND policyname = 'Authenticated users can create reviews'
    ) THEN
        CREATE POLICY "Authenticated users can create reviews" 
          ON public.app_reviews 
          FOR INSERT 
          TO authenticated
          WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'app_reviews' 
        AND policyname = 'Users can update own reviews'
    ) THEN
        CREATE POLICY "Users can update own reviews" 
          ON public.app_reviews 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'app_reviews' 
        AND policyname = 'Users can delete own reviews'
    ) THEN
        CREATE POLICY "Users can delete own reviews" 
          ON public.app_reviews 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Fix 5: Add input validation function and trigger (replace if exists)
CREATE OR REPLACE FUNCTION public.validate_review_content(content TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check for minimum length
  IF LENGTH(TRIM(content)) < 3 THEN
    RETURN FALSE;
  END IF;
  
  -- Check for maximum length
  IF LENGTH(content) > 1000 THEN
    RETURN FALSE;
  END IF;
  
  -- Basic XSS prevention - reject content with script tags
  IF content ~* '<script.*?>' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add validation trigger for app reviews
CREATE OR REPLACE FUNCTION public.validate_review_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate comment content
  IF NEW.comment IS NOT NULL AND NOT public.validate_review_content(NEW.comment) THEN
    RAISE EXCEPTION 'Invalid review content';
  END IF;
  
  -- Validate rating is within bounds
  IF NEW.rating IS NOT NULL AND (NEW.rating < 1 OR NEW.rating > 5) THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS validate_review_content_trigger ON public.app_reviews;
CREATE TRIGGER validate_review_content_trigger
  BEFORE INSERT OR UPDATE ON public.app_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_review_trigger();
