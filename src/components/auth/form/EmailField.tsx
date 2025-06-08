
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

interface EmailFieldProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  loading?: boolean;
  error?: string;
}

const EmailField = ({ email, setEmail, loading = false, error }: EmailFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-sm font-medium">
        Email Address
      </Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className={`pl-10 ${error ? 'border-destructive' : ''}`}
          autoComplete="email"
          aria-describedby={error ? "email-error" : undefined}
          aria-invalid={error ? "true" : "false"}
        />
      </div>
      {error && (
        <p id="email-error" className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default EmailField;
