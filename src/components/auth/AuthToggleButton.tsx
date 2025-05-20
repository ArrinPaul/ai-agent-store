
import React from "react";
import { Button } from "@/components/ui/button";

interface AuthToggleButtonProps {
  isSignUp: boolean;
  loading: boolean;
  onToggle: () => void;
}

const AuthToggleButton = ({ isSignUp, loading, onToggle }: AuthToggleButtonProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onToggle}
      className="w-full mt-6"
      disabled={loading}
    >
      {isSignUp ? "Sign In Instead" : "Create Account"}
    </Button>
  );
};

export default AuthToggleButton;
