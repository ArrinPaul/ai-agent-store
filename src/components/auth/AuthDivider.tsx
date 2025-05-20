
import React from "react";

interface AuthDividerProps {
  text: string;
}

const AuthDivider = ({ text }: AuthDividerProps) => {
  return (
    <div className="relative mt-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-background px-2 text-muted-foreground">
          {text}
        </span>
      </div>
    </div>
  );
};

export default AuthDivider;
