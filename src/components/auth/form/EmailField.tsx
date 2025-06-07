
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MailIcon } from "lucide-react";
import { useFormValidation } from "@/hooks/useFormValidation";
import ValidationMessage from "./FormValidation";

interface EmailFieldProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

const EmailField = ({ email, setEmail, loading }: EmailFieldProps) => {
  const { validateField, getValidationResult } = useFormValidation();
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);
    
    if (touched || value) {
      validateField('email', value, {
        email: {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }
      });
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validateField('email', email, {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    });
  };

  const validationResult = getValidationResult('email');

  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="your@email.com"
          disabled={loading}
          required
          className="bg-secondary/50 pl-10"
          aria-describedby={validationResult ? "email-validation" : undefined}
          autoComplete="email"
        />
        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      
      {validationResult && touched && (
        <div id="email-validation">
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

export default EmailField;
