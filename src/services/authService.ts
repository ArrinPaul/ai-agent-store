
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Enhanced email validation with XSS protection
export const validateEmail = (email: string): boolean => {
  if (!email || email.trim().length === 0) return false;
  
  // Basic XSS prevention - reject emails with script tags or HTML
  if (email.includes('<') || email.includes('>') || email.includes('script')) {
    return false;
  }
  
  // Enhanced email regex pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
};

// Enhanced password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (password.length > 128) {
    errors.push("Password must be less than 128 characters");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push("Password cannot contain repeated characters");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Check login attempts for rate limiting with enhanced security
export const handleLoginAttempt = async (email: string) => {
  const sanitizedEmail = sanitizeInput(email.toLowerCase());
  
  if (!validateEmail(sanitizedEmail)) {
    throw new Error('Invalid email format');
  }

  try {
    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('email', sanitizedEmail)
      .maybeSingle();

    if (error) {
      console.error('Error checking login attempts:', error);
      return null;
    }

    if (!data) {
      const { error: insertError } = await supabase
        .from('login_attempts')
        .insert([{ email: sanitizedEmail }]);
      
      if (insertError) console.error('Error creating login attempt:', insertError);
      return 1;
    }

    const newCount = (data.attempt_count || 0) + 1;
    
    // Check if account is locked
    if (data.is_locked) {
      throw new Error('Account is locked due to too many failed attempts. Please try again later.');
    }
    
    const { error: updateError } = await supabase
      .from('login_attempts')
      .update({ 
        attempt_count: newCount,
        last_attempt: new Date().toISOString(),
        is_locked: newCount >= 5
      })
      .eq('email', sanitizedEmail);

    if (updateError) console.error('Error updating login attempts:', updateError);
    
    if (newCount >= 5) {
      throw new Error('Too many failed attempts. Account has been locked.');
    }
    
    return newCount;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An error occurred while checking login attempts');
  }
};

// Reset login attempts after successful login
export const resetLoginAttempts = async (email: string) => {
  const sanitizedEmail = sanitizeInput(email.toLowerCase());
  
  const { error } = await supabase
    .from('login_attempts')
    .update({ 
      attempt_count: 0,
      is_locked: false
    })
    .eq('email', sanitizedEmail);

  if (error) console.error('Error resetting login attempts:', error);
};

// Enhanced sign in with security checks
export const signInWithEmailPassword = async (email: string, password: string) => {
  const sanitizedEmail = sanitizeInput(email.toLowerCase());
  
  if (!validateEmail(sanitizedEmail)) {
    throw new Error('Invalid email format');
  }
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    throw new Error('Invalid password format');
  }
  
  // Check rate limiting before attempting login
  await handleLoginAttempt(sanitizedEmail);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: sanitizedEmail,
    password,
  });

  if (error) throw error;
  
  // Reset login attempts on successful login
  if (data.user) {
    await resetLoginAttempts(sanitizedEmail);
  }
  
  return data;
};

// Enhanced sign up with security checks
export const signUpWithEmailPassword = async (email: string, password: string, username?: string) => {
  const sanitizedEmail = sanitizeInput(email.toLowerCase());
  const sanitizedUsername = username ? sanitizeInput(username) : undefined;
  
  if (!validateEmail(sanitizedEmail)) {
    throw new Error('Invalid email format');
  }
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors.join('. '));
  }
  
  if (sanitizedUsername && (sanitizedUsername.length < 3 || sanitizedUsername.length > 50)) {
    throw new Error('Username must be between 3 and 50 characters');
  }
  
  const { data, error } = await supabase.auth.signUp({
    email: sanitizedEmail,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: sanitizedUsername ? { username: sanitizedUsername } : undefined
    }
  });

  if (error) throw error;
  return data;
};
