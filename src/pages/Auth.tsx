
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import AuthForgotPassword from "@/components/auth/AuthForgotPassword";
import AuthLoginForm from "@/components/auth/AuthLoginForm";
import AuthSignupForm from "@/components/auth/AuthSignupForm";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthFooter from "@/components/auth/AuthFooter";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import AuthToggleButton from "@/components/auth/AuthToggleButton";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "true") {
      toast.info("Please set your new password below");
    }
    
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    
    checkSession();
    
    // Check for authentication error in URL
    const error = params.get("error");
    const error_description = params.get("error_description");
    if (error && error_description) {
      toast.error(`Authentication error: ${error_description}`);
    }
  }, [navigate]);

  const handleSocialLogin = async (provider: 'github' | 'discord') => {
    try {
      setLoading(true);
      
      // Thorough cleanup of auth state
      cleanupAuthState();
      
      // Try signing out first to prevent any auth state issues
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.error("Error during signout before social login:", err);
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
          queryParams: provider === 'github' ? {
            // Optional GitHub-specific params to request specific scopes
            // Uncomment if needed
            // scope: 'repo gist'
          } : undefined
        },
      });
      
      if (error) throw error;
      
      // We don't need to set loading to false here since we're redirecting
    } catch (error: any) {
      toast.error(error.message || `Error signing in with ${provider}`);
      setLoading(false);
    }
  };
  
  // Helper function to clean up auth state
  const cleanupAuthState = () => {
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
  };

  if (isForgotPassword) {
    return (
      <AuthForgotPassword 
        email={email} 
        setEmail={setEmail} 
        loading={loading}
        setLoading={setLoading}
        setIsForgotPassword={setIsForgotPassword}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 overflow-x-hidden">
      <div className="w-full max-w-md p-6 sm:p-8 glass-effect rounded-xl shadow-card animate-fadeIn">
        <AuthHeader title={isSignUp ? "Create Account" : "Welcome Back"} />
        
        <AnimatePresence mode="wait">
          {isSignUp ? (
            <AuthSignupForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              setLoading={setLoading}
              setIsSignUp={setIsSignUp}
            />
          ) : (
            <AuthLoginForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              setLoading={setLoading}
              setIsSignUp={setIsSignUp}
              setIsForgotPassword={setIsForgotPassword}
            />
          )}
        </AnimatePresence>

        <AuthDivider text="Or continue with" />
        
        <SocialLoginButtons 
          loading={loading} 
          handleSocialLogin={handleSocialLogin} 
        />

        <AuthDivider text={isSignUp ? "Already have an account?" : "Don't have an account?"} />

        <AuthToggleButton 
          isSignUp={isSignUp} 
          loading={loading} 
          onToggle={() => setIsSignUp(!isSignUp)} 
        />
      </div>
      
      <AuthFooter />
    </div>
  );
};

export default Auth;
