
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { motion } from "framer-motion";
import EmailField from "./form/EmailField";
import PasswordField from "./form/PasswordField";
import PasswordStrengthMeter from "./form/PasswordStrengthMeter";

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
  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const getPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
    };
    return Object.values(checks).filter(Boolean).length;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (getPasswordStrength(password) < 3) {
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
        <EmailField 
          email={email} 
          setEmail={setEmail} 
          disabled={loading} 
        />
        
        <div className="space-y-3">
          <PasswordField 
            password={password} 
            setPassword={setPassword} 
            disabled={loading}
            showStrengthMeter={true}
          />
          
          <PasswordStrengthMeter password={password} />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || (getPasswordStrength(password) < 3)}
        >
          {loading && <Loader variant="dots" className="mr-2" />}
          Create Account
        </Button>
      </form>
    </motion.div>
  );
};

export default AuthSignupForm;
