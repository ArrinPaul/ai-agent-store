
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Check login attempts for rate limiting
export const handleLoginAttempt = async (email: string) => {
  const { data, error } = await supabase
    .from('login_attempts')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('Error checking login attempts:', error);
    return null;
  }

  if (!data) {
    const { error: insertError } = await supabase
      .from('login_attempts')
      .insert([{ email }]);
    
    if (insertError) console.error('Error creating login attempt:', insertError);
    return 1;
  }

  const newCount = (data.attempt_count || 0) + 1;
  const { error: updateError } = await supabase
    .from('login_attempts')
    .update({ 
      attempt_count: newCount,
      last_attempt: new Date().toISOString(),
      is_locked: newCount >= 5
    })
    .eq('email', email);

  if (updateError) console.error('Error updating login attempts:', updateError);
  return newCount;
};

// Reset login attempts after successful login
export const resetLoginAttempts = async (email: string) => {
  const { error } = await supabase
    .from('login_attempts')
    .update({ 
      attempt_count: 0,
      is_locked: false
    })
    .eq('email', email);

  if (error) console.error('Error resetting login attempts:', error);
};

// Handle user login
export const signInWithEmailPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};
