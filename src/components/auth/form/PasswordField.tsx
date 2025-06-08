
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  loading?: boolean;
  error?: string;
  label?: string;
  placeholder?: string;
  showStrength?: boolean;
}

const PasswordField = ({ 
  password, 
  setPassword, 
  loading = false, 
  error,
  label = "Password",
  placeholder = "Enter your password",
  showStrength = false
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="password" className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className={`pl-10 pr-12 ${error ? 'border-destructive' : ''}`}
          autoComplete={showStrength ? "new-password" : "current-password"}
          aria-describedby={error ? "password-error" : undefined}
          aria-invalid={error ? "true" : "false"}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          onClick={togglePasswordVisibility}
          disabled={loading}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error && (
        <p id="password-error" className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordField;
