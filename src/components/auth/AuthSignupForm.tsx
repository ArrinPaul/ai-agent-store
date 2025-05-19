
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { EyeIcon, EyeOffIcon, MailIcon, CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AuthSignupFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthSignupForm = ({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  loading, 
  setLoading, 
  setIsSignUp 
}: AuthSignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    number: false,
    special: false,
  });

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (passwordStrength < 2) {
      toast.error("Please create a stronger password");
      return;
    }

    setLoading(true);

    try {
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
      <form onSubmit={handleSignup} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email-signup">Email</Label>
          <div className="relative">
            <Input
              id="email-signup"
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
          <Label htmlFor="password-signup">Password</Label>
          <div className="relative">
            <Input
              id="password-signup"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
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
          
          {password && (
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
          disabled={loading || (passwordStrength < 2)}
        >
          {loading && <Loader variant="dots" className="mr-2" />}
          Create Account
        </Button>
      </form>
    </motion.div>
  );
};

export default AuthSignupForm;
