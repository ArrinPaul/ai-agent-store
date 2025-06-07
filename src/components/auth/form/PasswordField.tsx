
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useFormValidation } from "@/hooks/useFormValidation";
import ValidationMessage from "./FormValidation";

interface PasswordFieldProps {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  showStrength?: boolean;
}

const PasswordField = ({ password, setPassword, loading, showStrength = false }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const { validateField, getValidationResult } = useFormValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (touched || value) {
      validateField('password', value, {
        password: {
          required: true,
          minLength: 6,
          requireNumber: showStrength,
          requireSpecial: showStrength,
          requireUppercase: showStrength,
          requireLowercase: showStrength,
        }
      });
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validateField('password', password, {
      password: {
        required: true,
        minLength: 6,
        requireNumber: showStrength,
        requireSpecial: showStrength,
        requireUppercase: showStrength,
        requireLowercase: showStrength,
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow toggling password visibility with Ctrl+Shift+P
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      e.preventDefault();
      setShowPassword(!showPassword);
    }
  };

  const validationResult = getValidationResult('password');

  return (
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Enter password"
          disabled={loading}
          required
          className="bg-secondary/50 pr-10"
          aria-describedby={validationResult ? "password-validation" : undefined}
          autoComplete="current-password"
        />
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? 
            <EyeOffIcon className="h-4 w-4" /> : 
            <EyeIcon className="h-4 w-4" />
          }
        </button>
      </div>
      
      {validationResult && touched && (
        <div id="password-validation">
          <ValidationMessage
            message={validationResult.message}
            type={validationResult.type}
            show={true}
          />
        </div>
      )}
    </div>
  );
};

export default PasswordField;
