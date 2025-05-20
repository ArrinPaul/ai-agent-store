
import { toast } from "sonner";

export const useAuthValidation = () => {
  const validateEmail = (email: string) => {
    const isValid = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (!isValid) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  return {
    validateEmail,
    validatePassword
  };
};

export default useAuthValidation;
