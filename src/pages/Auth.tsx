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
  CircleUserIcon,
  AlertCircleIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    number: false,
    special: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "true") {
      toast.info("Please set your new password below");
    }
  }, []);

  useEffect(() => {
    if (password) {
      const meetsLength = password.length >= 8;
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      setPasswordChecks({
        length: meetsLength,
        number: hasNumber,
        special: hasSpecial,
      });
      
      let score = 0;
      if (meetsLength) score++;
      if (hasNumber) score++;
      if (hasSpecial) score++;
      
      setPasswordStrength(score);
    } else {
      setPasswordStrength(0);
      setPasswordChecks({
        length: false,
        number: false,
        special: false,
      });
    }
  }, [password]);

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

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Error signing in with social provider");
    }
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

    if (isSignUp && passwordStrength < 2) {
      toast.error("Please create a stronger password");
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

  const renderForm = () => {
    if (isForgotPassword) {
      return (
        <motion.form 
          onSubmit={handleResetPassword} 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="your@email.com"
                disabled={loading}
                required
                className="bg-secondary/50 pl-10"
              />
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
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
        </motion.form>
      );
    }

    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        key={isSignUp ? "signup" : "signin"}
      >
        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="your@email.com"
                disabled={loading}
                required
                className="bg-secondary/50 pl-10"
              />
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? "Create password" : "Enter password"}
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
            
            {isSignUp && password && (
              <div className="pt-2">
                <div className="flex gap-1 mb-2">
                  <div className={cn("h-1 flex-1 rounded-full", passwordStrength >= 1 ? "bg-red-500" : "bg-muted")}></div>
                  <div className={cn("h-1 flex-1 rounded-full", passwordStrength >= 2 ? "bg-yellow-500" : "bg-muted")}></div>
                  <div className={cn("h-1 flex-1 rounded-full", passwordStrength >= 3 ? "bg-green-500" : "bg-muted")}></div>
                </div>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center text-muted-foreground">
                    {passwordChecks.length ? 
                      <CheckIcon className="h-3 w-3 mr-1 text-green-500" /> : 
                      <XIcon className="h-3 w-3 mr-1 text-red-500" />}
                    At least 8 characters
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    {passwordChecks.number ? 
                      <CheckIcon className="h-3 w-3 mr-1 text-green-500" /> : 
                      <XIcon className="h-3 w-3 mr-1 text-red-500" />}
                    At least one number
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    {passwordChecks.special ? 
                      <CheckIcon className="h-3 w-3 mr-1 text-green-500" /> : 
                      <XIcon className="h-3 w-3 mr-1 text-red-500" />}
                    At least one special character
                  </li>
                </ul>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || (isSignUp && passwordStrength < 2)}
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
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleSocialLogin('google')}
            className="flex-1" 
            disabled={loading}
          >
            <CircleUserIcon className="h-4 w-4 mr-2" />
            Google
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
          variant="ghost"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full"
          disabled={loading}
        >
          {isSignUp ? "Sign In Instead" : "Create Account"}
        </Button>
      </motion.div>
    );
  };

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
          {isForgotPassword 
            ? "Reset Password"
            : isSignUp 
              ? "Create Account" 
              : "Welcome Back"}
        </motion.h1>
        
        <AnimatePresence mode="wait">
          {renderForm()}
        </AnimatePresence>
      </div>
      
      <p className="mt-8 text-sm text-muted-foreground">
        AI Agent Store &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Auth;
