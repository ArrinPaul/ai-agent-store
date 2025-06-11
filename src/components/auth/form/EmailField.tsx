
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { validateEmail } from '@/services/authService';
import ValidationMessage from './FormValidation';

interface EmailFieldProps {
  email: string;
  setEmail: (email: string) => void;
  disabled?: boolean;
  showValidation?: boolean;
}

const EmailField = ({ email, setEmail, disabled = false, showValidation = false }: EmailFieldProps) => {
  const isValidEmail = !email || validateEmail(email);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
        Email Address
      </Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
          className={`pl-10 ${!isValidEmail ? 'border-red-500' : ''}`}
          autoComplete="email"
          required
        />
      </div>
      {showValidation && (
        <ValidationMessage
          message={!isValidEmail ? "Please enter a valid email address" : ""}
          type="error"
          show={!isValidEmail && email.length > 0}
        />
      )}
    </div>
  );
};

export default EmailField;
