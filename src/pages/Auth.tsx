
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { 
  EyeIcon, 
  EyeOffIcon, 
  ArrowLeftIcon, 
  CheckIcon, 
  XIcon, 
  GithubIcon,
  MailIcon,
  DiscordIcon,
  AlertCircleIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import AuthForgotPassword from "@/components/auth/AuthForgotPassword";
import AuthLoginForm from "@/components/auth/AuthLoginForm";
import AuthSignupForm from "@/components/auth/AuthSignupForm";

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
  }, [navigate]);

  const handleSocialLogin = async (provider: 'github' | 'discord') => {
    try {
      setLoading(true);
      
      // Clean up any existing auth state
      cleanupAuthState();
      
      // Try signing out first to prevent any auth state issues
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Error signing in with social provider");
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
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold text-center mb-8"
          key={`${isForgotPassword}-${isSignUp}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isSignUp ? "Create Account" : "Welcome Back"}
        </motion.h1>
        
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

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleSocialLogin('discord')}
            className="flex-1" 
            disabled={loading}
          >
            <DiscordIcon className="h-4 w-4 mr-2" />
            Discord
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleSocialLogin('github')}
            className="flex-1" 
            disabled={loading}
          >
            <GithubIcon className="h-4 w-4 mr-2" />
            GitHub
          </Button>
        </div>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-6"
          disabled={loading}
        >
          {isSignUp ? "Sign In Instead" : "Create Account"}
        </Button>
      </div>
      
      <p className="mt-8 text-sm text-muted-foreground">
        AI Agent Store &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Auth;
