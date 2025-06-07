
import React from 'react';
import { CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

const PasswordStrengthMeter = ({ password, className }: PasswordStrengthMeterProps) => {
  const checks = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  
  const getStrengthColor = () => {
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-yellow-500";
    if (score <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (score <= 2) return "Weak";
    if (score <= 3) return "Fair";
    if (score <= 4) return "Good";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                score >= level ? getStrengthColor() : "bg-muted"
              )}
            />
          ))}
        </div>
        <span className="text-xs font-medium">{getStrengthText()}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center">
          {checks.length ? 
            <CheckIcon className="h-3 w-3 mr-1 text-green-500" /> : 
            <XIcon className="h-3 w-3 mr-1 text-red-500" />}
          8+ characters
        </div>
        <div className="flex items-center">
          {checks.number ? 
            <CheckIcon className="h-3 w-3 mr-1 text-green-500" /> : 
            <XIcon className="h-3 w-3 mr-1 text-red-500" />}
          Number
        </div>
        <div className="flex items-center">
          {checks.uppercase ? 
            <CheckIcon className="h-3 w-3 mr-1 text-green-500" /> : 
            <XIcon className="h-3 w-3 mr-1 text-red-500" />}
          Uppercase
        </div>
        <div className="flex items-center">
          {checks.lowercase ? 
            <CheckIcon className="h-3 w-3 mr-1 text-green-500" /> : 
            <XIcon className="h-3 w-3 mr-1 text-red-500" />}
          Lowercase
        </div>
        <div className="flex items-center col-span-2">
          {checks.special ? 
            <CheckIcon className="h-3 w-3 mr-1 text-green-500" /> : 
            <XIcon className="h-3 w-3 mr-1 text-red-500" />}
          Special character (!@#$%^&*)
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
