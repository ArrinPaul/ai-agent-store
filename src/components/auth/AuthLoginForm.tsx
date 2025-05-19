
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { EyeIcon, EyeOffIcon, MailIcon } from "lucide-react";
import { motion } from "framer-motion";

interface AuthLoginFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  setIsForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthLoginForm = ({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  loading, 
  setLoading, 
  setIsSignUp, 
  setIsForgotPassword 
}: AuthLoginFormProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = async (e: React.FormEvent) => {
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
      const attemptCount = await handleLoginAttempt(email);
      
      if (attemptCount && attemptCount >= 5) {
        toast.error("Too many failed attempts. Please try again later or reset your password.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast.error(`Invalid email or password. ${attemptCount ? 5 - attemptCount : 4} attempts remaining.`);
        } else {
          throw error;
        }
      } else {
        await resetLoginAttempts(email);
        toast.success("Successfully signed in!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleLogin} className="space-y-6">
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
              placeholder="Enter password"
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
          Sign In
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsForgotPassword(true)}
          className="w-full text-sm"
          disabled={loading}
        >
          Forgot Password?
        </Button>
      </form>
    </motion.div>
  );
};

export default AuthLoginForm;
