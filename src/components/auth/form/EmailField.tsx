
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MailIcon } from "lucide-react";

interface EmailFieldProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

const EmailField = ({ email, setEmail, loading }: EmailFieldProps) => {
  return (
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
  );
};

export default EmailField;
