
import React from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

// Imported components
import EmailField from "./form/EmailField";
import PasswordField from "./form/PasswordField";
import AuthButtons from "./form/AuthButtons";

// Hooks and services
import useAuthValidation from "@/hooks/useAuthValidation";
import { handleLoginAttempt, resetLoginAttempts, signInWithEmailPassword } from "@/services/authService";

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
  const { validateEmail, validatePassword } = useAuthValidation();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    setLoading(true);

    try {
      // Check login attempts for rate limiting
      const attemptCount = await handleLoginAttempt(email);
      
      if (attemptCount && attemptCount >= 5) {
        toast.error("Too many failed attempts. Please try again later or reset your password.");
        setLoading(false);
        return;
      }

      // Try to sign in
      try {
        await signInWithEmailPassword(email, password);
        await resetLoginAttempts(email);
        toast.success("Successfully signed in!");
        navigate("/");
      } catch (error: any) {
        if (error.message === "Invalid login credentials") {
          toast.error(`Invalid email or password. ${attemptCount ? 5 - attemptCount : 4} attempts remaining.`);
        } else {
          throw error;
        }
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
        <EmailField 
          email={email} 
          setEmail={setEmail} 
          loading={loading} 
        />
        
        <PasswordField 
          password={password} 
          setPassword={setPassword} 
          loading={loading} 
        />

        <AuthButtons 
          loading={loading} 
          setIsForgotPassword={setIsForgotPassword} 
        />
      </form>
    </motion.div>
  );
};

export default AuthLoginForm;
