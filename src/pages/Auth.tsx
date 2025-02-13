
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpVerification, setIsOtpVerification] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleLoginAttempt = async (email: string) => {
    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
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

  const sendOtpEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?otp=true`,
      });
      
      if (error) throw error;
      
      setIsOtpVerification(true);
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      toast.error("Error sending OTP: " + error.message);
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
          await sendOtpEmail(email);
          setIsOtpVerification(true);
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
    if (isOtpVerification) {
      return (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium mb-2">
              Enter OTP from Email
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim())}
              className="w-full px-4 py-2 rounded-lg bg-secondary/50 border focus:ring-2 focus:ring-primary/20"
              placeholder="Enter OTP"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOtpVerification(false);
              setOtp("");
            }}
            className="w-full text-center mt-4 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Back to Sign In
          </button>
        </form>
      );
    }

    if (isForgotPassword) {
      return (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="w-full px-4 py-2 rounded-lg bg-secondary/50 border focus:ring-2 focus:ring-primary/20"
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Loading..." : "Send Reset Instructions"}
          </button>

          <button
            type="button"
            onClick={() => setIsForgotPassword(false)}
            className="w-full text-center mt-4 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Back to Sign In
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={handleAuth} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            className="w-full px-4 py-2 rounded-lg bg-secondary/50 border focus:ring-2 focus:ring-primary/20"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-secondary/50 border focus:ring-2 focus:ring-primary/20"
            placeholder="Min. 6 characters"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>

        {!isSignUp && (
          <button
            type="button"
            onClick={() => setIsForgotPassword(true)}
            className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot Password?
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 glass-effect rounded-xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          {isOtpVerification 
            ? "Enter OTP"
            : isForgotPassword 
              ? "Reset Password"
              : isSignUp 
                ? "Create Account" 
                : "Welcome Back"}
        </h1>
        
        {renderForm()}
      </div>
    </div>
  );
};

export default Auth;
