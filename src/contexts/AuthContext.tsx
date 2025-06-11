
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isAuthenticated: false,
  signOut: async () => {},
});

// Enhanced helper function to clean up auth state
const cleanupAuthState = () => {
  try {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error cleaning up auth state:', error);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!session;

  // Enhanced sign out function with better security cleanup
  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out with better error handling
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        console.warn('Sign out error (continuing anyway):', signOutError);
      }
      
      // Reset state
      setSession(null);
      setUser(null);
      
      // Clear any remaining session data
      try {
        await supabase.auth.getSession();
      } catch (error) {
        console.warn('Error clearing session:', error);
      }
      
      // Force page reload for a clean state
      window.location.href = '/auth';
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Error signing out. Please try again.");
      
      // Force cleanup and redirect even if there's an error
      cleanupAuthState();
      window.location.href = '/auth';
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change:", event);
        setSession(session);
        setUser(session?.user || null);
        
        // If signed in, save the timestamp securely
        if (event === 'SIGNED_IN') {
          try {
            localStorage.setItem('lastAuthenticated', new Date().toISOString());
            
            // Defer any additional operations to prevent potential deadlocks
            setTimeout(() => {
              console.log("User signed in:", session?.user?.email);
            }, 0);
          } catch (error) {
            console.error('Error saving auth data to localStorage', error);
          }
        } else if (event === 'SIGNED_OUT') {
          // Ensure clean state on sign out
          cleanupAuthState();
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        cleanupAuthState();
      }
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading, isAuthenticated, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
