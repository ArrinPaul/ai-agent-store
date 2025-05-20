
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

interface AuthButtonsProps {
  loading: boolean;
  setIsForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthButtons = ({ loading, setIsForgotPassword }: AuthButtonsProps) => {
  return (
    <>
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading && <Loader variant="dots" className="mr-2" />}
        Sign In
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsForgotPassword(true)}
        className="w-full text-sm"
        disabled={loading}
      >
        Forgot Password?
      </Button>
    </>
  );
};

export default AuthButtons;
