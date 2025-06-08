
import { useState, useCallback } from 'react';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((
    fieldName: string,
    value: string,
    rules: ValidationRule[]
  ): ValidationResult => {
    for (const rule of rules) {
      if (!rule.test(value)) {
        const error = { [fieldName]: rule.message };
        setErrors(prev => ({ ...prev, ...error }));
        return { isValid: false, message: rule.message };
      }
    }
    
    // Clear error if validation passes
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    
    return { isValid: true, message: '' };
  }, []);

  const clearError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    clearError,
    clearAllErrors
  };
};

// Common validation rules
export const validationRules = {
  email: {
    test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  
  passwordLength: {
    test: (value: string) => value.length >= 8,
    message: 'Password must be at least 8 characters long'
  },
  
  passwordUppercase: {
    test: (value: string) => /[A-Z]/.test(value),
    message: 'Password must contain at least one uppercase letter'
  },
  
  passwordLowercase: {
    test: (value: string) => /[a-z]/.test(value),
    message: 'Password must contain at least one lowercase letter'
  },
  
  passwordNumber: {
    test: (value: string) => /\d/.test(value),
    message: 'Password must contain at least one number'
  },
  
  passwordSpecial: {
    test: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
    message: 'Password must contain at least one special character'
  },
  
  required: {
    test: (value: string) => value.trim().length > 0,
    message: 'This field is required'
  }
};
