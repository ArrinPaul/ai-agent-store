
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, GithubIcon, Apple, Twitter } from "lucide-react";

interface SocialLoginButtonsProps {
  loading: boolean;
  handleSocialLogin: (provider: 'github' | 'discord' | 'apple' | 'twitter') => Promise<void>;
}

const SocialLoginButtons = ({ loading, handleSocialLogin }: SocialLoginButtonsProps) => {
  return (
    <div className="space-y-3 mt-6">
      {/* Primary social logins */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => handleSocialLogin('discord')}
          className="flex-1" 
          disabled={loading}
          aria-label="Sign in with Discord"
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
          aria-label="Sign in with GitHub"
        >
          <GithubIcon className="h-4 w-4 mr-2" />
          GitHub
        </Button>
      </div>
      
      {/* Secondary social logins */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => handleSocialLogin('apple')}
          className="flex-1" 
          disabled={loading}
          aria-label="Sign in with Apple"
        >
          <Apple className="h-4 w-4 mr-2" />
          Apple
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => handleSocialLogin('twitter')}
          className="flex-1" 
          disabled={loading}
          aria-label="Sign in with Twitter"
        >
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </Button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
