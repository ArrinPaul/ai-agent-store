
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

// Imported components
import EmailField from "./form/EmailField";
import PasswordField from "./form/PasswordField";
import AuthButtons from "./form/AuthButtons";
import AuthErrorDisplay from "./AuthErrorDisplay";
import AuthSuccessAnimation from "./AuthSuccessAnimation";
import RememberMeCheckbox from "./RememberMeCheckbox";

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
  const [error, setError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate inputs
    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    setLoading(true);

    try {
      // Check login attempts for rate limiting
      const attemptCount = await handleLoginAttempt(email);
      
      if (attemptCount && attemptCount >= 5) {
        setError("Too many failed attempts. Please try again later or reset your password.");
        setLoading(false);
        return;
      }

      // Try to sign in
      try {
        await signInWithEmailPassword(email, password);
        await resetLoginAttempts(email);
        
        // Show success animation
        setShowSuccess(true);
        
        // Handle remember me option
        if (rememberMe) {
          localStorage.setItem('remember_me', 'true');
        }
        
        setTimeout(() => {
          toast.success("Successfully signed in!");
          navigate("/");
        }, 1500);
      } catch (error: any) {
        if (error.message === "Invalid login credentials") {
          setError(`Invalid email or password. ${attemptCount ? 5 - attemptCount : 4} attempts remaining.`);
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError("");
    handleLogin(new Event('submit') as any);
  };

  return (
    <>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleLogin} className="space-y-6">
          <AnimatePresence>
            {error && (
              <AuthErrorDisplay
                error={error}
                onRetry={handleRetry}
              />
            )}
          </AnimatePresence>

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

          <RememberMeCheckbox
            checked={rememberMe}
            onCheckedChange={setRememberMe}
            disabled={loading}
          />

          <AuthButtons 
            loading={loading} 
            setIsForgotPassword={setIsForgotPassword} 
          />
        </form>
      </motion.div>

      <AuthSuccessAnimation
        message="Welcome back!"
        show={showSuccess}
      />
    </>
  );
};

export default AuthLoginForm;
