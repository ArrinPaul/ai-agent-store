
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null; // Added user property
  loading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null, // Added user property
  loading: true,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null); // Added user state
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!session;

  useEffect(() => {
    // Set up auth state listener FIRST to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null); // Set user from session
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null); // Set user from session
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Create a persistent auth store in localStorage
  useEffect(() => {
    if (session) {
      try {
        localStorage.setItem('lastAuthenticated', new Date().toISOString());
      } catch (error) {
        console.error('Error saving auth data to localStorage', error);
      }
    }
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, user, loading, isAuthenticated }}>
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
