
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, GithubIcon } from "lucide-react";

interface SocialLoginButtonsProps {
  loading: boolean;
  handleSocialLogin: (provider: 'github' | 'discord') => Promise<void>;
}

const SocialLoginButtons = ({ loading, handleSocialLogin }: SocialLoginButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => handleSocialLogin('discord')}
        className="flex-1" 
        disabled={loading}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Discord
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => handleSocialLogin('github')}
        className="flex-1" 
        disabled={loading}
      >
        <GithubIcon className="h-4 w-4 mr-2" />
        GitHub
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
