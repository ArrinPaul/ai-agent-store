
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { validatePassword } from '@/services/authService';
import ValidationMessage from './FormValidation';

interface PasswordFieldProps {
  password: string;
  setPassword: (password: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  showValidation?: boolean;
  showStrengthMeter?: boolean;
}

const PasswordField = ({ 
  password, 
  setPassword, 
  label = "Password", 
  placeholder = "Enter your password",
  disabled = false,
  showValidation = false,
  showStrengthMeter = false
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const validation = validatePassword(password);
  const hasPassword = password.length > 0;
  
  return (
    <div className="space-y-2">
      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={disabled}
          className={`pl-10 pr-10 ${showValidation && hasPassword && !validation.isValid ? 'border-red-500' : ''}`}
          autoComplete={label.toLowerCase().includes('confirm') ? "new-password" : "current-password"}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          disabled={disabled}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      
      {showValidation && hasPassword && !validation.isValid && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <ValidationMessage
              key={index}
              message={error}
              type="error"
              show={true}
            />
          ))}
        </div>
      )}
      
      {showStrengthMeter && hasPassword && (
        <div className="space-y-1">
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded ${
                  validation.errors.length <= 4 - level
                    ? validation.errors.length === 0
                      ? 'bg-green-500'
                      : validation.errors.length <= 2
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600">
            Password strength: {validation.isValid ? 'Strong' : validation.errors.length <= 2 ? 'Medium' : 'Weak'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PasswordField;
