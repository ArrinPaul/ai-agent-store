
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface RememberMeCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const RememberMeCheckbox = ({ checked, onCheckedChange, disabled }: RememberMeCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="remember-me"
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      <Label
        htmlFor="remember-me"
        className="text-sm text-muted-foreground cursor-pointer"
      >
        Remember me for 30 days
      </Label>
    </div>
  );
};

export default RememberMeCheckbox;
