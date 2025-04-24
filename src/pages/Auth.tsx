
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { EyeIcon, EyeOffIcon, ArrowLeftIcon } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check if the URL contains a reset param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "true") {
      toast.info("Please set your new password below");
    }
  }, []);

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleLoginAttempt = async (email: string) => {
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
      // First attempt
      const { error: insertError } = await supabase
        .from('login_attempts')
        .insert([{ email }]);
      
      if (insertError) console.error('Error creating login attempt:', insertError);
      return 1;
    }

    // Update attempt count
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

  const resetLoginAttempts = async (email: string) => {
    const { error } = await supabase
      .from('login_attempts')
      .update({ 
        attempt_count: 0,
        is_locked: false
      })
      .eq('email', email);

    if (error) console.error('Error resetting login attempts:', error);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;

      toast.success("Password reset instructions sent to your email!");
      setIsForgotPassword(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        if (data.user?.identities?.length === 0) {
          toast.error("This email is already registered. Please sign in instead.");
          setIsSignUp(false);
        } else {
          toast.success("Check your email to confirm your account!");
        }
      } else {
        // Check login attempts before proceeding
        const attemptCount = await handleLoginAttempt(email);
        
        if (attemptCount >= 5) {
          toast.error("Too many failed attempts. Please try again later.");
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message === "Invalid login credentials") {
            toast.error(`Invalid email or password. ${5 - attemptCount} attempts remaining.`);
          } else {
            throw error;
          }
        } else {
          await resetLoginAttempts(email);
          toast.success("Successfully signed in!");
          navigate("/");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show the main form content based on the current mode
  const renderForm = () => {
    if (isForgotPassword) {
      return (
        <form onSubmit={handleResetPassword} className="space-y-6 animate-fadeIn">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder="your@email.com"
              disabled={loading}
              required
              className="bg-secondary/50"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? <Loader variant="dots" className="mr-2" /> : null}
            Send Reset Instructions
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsForgotPassword(false)}
            className="w-full"
            disabled={loading}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Sign In
          </Button>
        </form>
      );
    }

    return (
      <form onSubmit={handleAuth} className="space-y-6 animate-fadeIn">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="your@email.com"
            disabled={loading}
            required
            className="bg-secondary/50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              disabled={loading}
              required
              className="bg-secondary/50 pr-10"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? 
                <EyeOffIcon className="h-4 w-4" /> : 
                <EyeIcon className="h-4 w-4" />
              }
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading && <Loader variant="dots" className="mr-2" />}
          {isSignUp ? "Create Account" : "Sign In"}
        </Button>

        {!isSignUp && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsForgotPassword(true)}
            className="w-full text-sm"
            disabled={loading}
          >
            Forgot Password?
          </Button>
        )}

        <div className="relative">
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
          variant="outline"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full"
          disabled={loading}
        >
          {isSignUp ? "Sign In Instead" : "Create Account"}
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-6 sm:p-8 glass-effect rounded-xl shadow-card animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          {isForgotPassword 
            ? "Reset Password"
            : isSignUp 
              ? "Create Account" 
              : "Welcome Back"}
        </h1>
        
        {renderForm()}
      </div>
      
      <p className="mt-8 text-sm text-muted-foreground">
        AI Agent Store &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Auth;
