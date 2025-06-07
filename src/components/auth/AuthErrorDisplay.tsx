
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface AuthErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

const AuthErrorDisplay = ({ error, onRetry, className }: AuthErrorDisplayProps) => {
  const getErrorMessage = (error: string) => {
    if (error.includes("Invalid login credentials")) {
      return "Invalid email or password. Please check your credentials and try again.";
    }
    if (error.includes("Email not confirmed")) {
      return "Please check your email and click the confirmation link before signing in.";
    }
    if (error.includes("Too many requests")) {
      return "Too many login attempts. Please wait a few minutes before trying again.";
    }
    if (error.includes("Network error")) {
      return "Network connection issue. Please check your internet and try again.";
    }
    return error;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{getErrorMessage(error)}</span>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="ml-2 h-6 px-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default AuthErrorDisplay;
