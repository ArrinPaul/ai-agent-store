
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  securityStatus: {
    sessionExpiry: Date | null;
    isSecureConnection: boolean;
    lastActivity: Date | null;
  };
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isAuthenticated: false,
  signOut: async () => {},
  securityStatus: {
    sessionExpiry: null,
    isSecureConnection: false,
    lastActivity: null,
  },
});

// Enhanced helper function to clean up auth state with security logging
const cleanupAuthState = () => {
  try {
    console.log('Cleaning up authentication state for security');
    
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
    
    // Clear any potentially sensitive data
    localStorage.removeItem('remember_me');
    localStorage.removeItem('lastAuthenticated');
    
    console.log('Auth state cleanup completed');
  } catch (error) {
    console.error('Error cleaning up auth state:', error);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const isAuthenticated = !!session;

  // Security status tracking
  const securityStatus = {
    sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000) : null,
    isSecureConnection: window.location.protocol === 'https:',
    lastActivity,
  };

  // Activity tracking for security
  useEffect(() => {
    const updateActivity = () => {
      if (session) {
        setLastActivity(new Date());
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [session]);

  // Session timeout monitoring
  useEffect(() => {
    if (!session) return;

    const checkSessionExpiry = () => {
      const now = new Date().getTime();
      const expiryTime = session.expires_at * 1000;
      const timeUntilExpiry = expiryTime - now;

      // Warn user 5 minutes before expiry
      if (timeUntilExpiry <= 5 * 60 * 1000 && timeUntilExpiry > 0) {
        toast.warning("Your session will expire soon. Please save your work.");
      }

      // Auto logout if expired
      if (timeUntilExpiry <= 0) {
        console.log('Session expired, forcing logout for security');
        signOut();
      }
    };

    const interval = setInterval(checkSessionExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [session]);

  // Enhanced sign out function with comprehensive security cleanup
  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Initiating secure logout process');
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out with better error handling
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log('Global sign out completed');
      } catch (signOutError) {
        console.warn('Sign out error (continuing anyway):', signOutError);
      }
      
      // Reset state
      setSession(null);
      setUser(null);
      setLastActivity(null);
      
      // Clear any remaining session data
      try {
        await supabase.auth.getSession();
      } catch (error) {
        console.warn('Error clearing session:', error);
      }
      
      console.log('Secure logout process completed');
      
      // Force page reload for a clean state
      window.location.href = '/auth';
    } catch (error: any) {
      console.error("Error during secure logout:", error);
      toast.error("Error signing out. Please try again.");
      
      // Force cleanup and redirect even if there's an error
      cleanupAuthState();
      window.location.href = '/auth';
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Security-enhanced auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change detected:", event);
        
        // Security logging
        if (event === 'SIGNED_IN') {
          console.log('User authenticated successfully');
          setLastActivity(new Date());
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setLastActivity(null);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Security: Token refreshed successfully');
        }
        
        setSession(session);
        setUser(session?.user || null);
        
        // Save authentication timestamp securely
        if (event === 'SIGNED_IN' && session) {
          try {
            const authData = {
              timestamp: new Date().toISOString(),
              userId: session.user.id.substring(0, 8) + '***', // Partial ID for logging
            };
            localStorage.setItem('lastAuthenticated', JSON.stringify(authData));
          } catch (error) {
            console.error('Error saving auth data to localStorage', error);
          }
        } else if (event === 'SIGNED_OUT') {
          cleanupAuthState();
        }
        
        setLoading(false);
      }
    );

    // Check for existing session with security validation
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        cleanupAuthState();
      } else if (session) {
        // Validate session hasn't expired
        const now = new Date().getTime();
        const expiryTime = session.expires_at * 1000;
        
        if (expiryTime <= now) {
          console.log('Found expired session, cleaning up');
          cleanupAuthState();
          setSession(null);
          setUser(null);
        } else {
          console.log('Valid session found');
          setSession(session);
          setUser(session.user);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      isAuthenticated, 
      signOut,
      securityStatus 
    }}>
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
