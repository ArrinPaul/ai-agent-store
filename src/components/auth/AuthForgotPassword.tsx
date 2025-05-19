
import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { MailIcon, ArrowLeftIcon } from "lucide-react";
import { motion } from "framer-motion";

interface AuthForgotPasswordProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthForgotPassword = ({ 
  email, 
  setEmail, 
  loading, 
  setLoading, 
  setIsForgotPassword 
}: AuthForgotPasswordProps) => {
  
  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 overflow-x-hidden">
      <div className="w-full max-w-md p-6 sm:p-8 glass-effect rounded-xl shadow-card animate-fadeIn">
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Reset Password
        </motion.h1>
        
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
      </div>
      
      <p className="mt-8 text-sm text-muted-foreground">
        AI Agent Store &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default AuthForgotPassword;
