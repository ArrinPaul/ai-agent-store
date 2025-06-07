
import { useState, useCallback } from 'react';

interface ValidationRules {
  email?: {
    required?: boolean;
    pattern?: RegExp;
  };
  password?: {
    required?: boolean;
    minLength?: number;
    requireNumber?: boolean;
    requireSpecial?: boolean;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
  };
}

interface ValidationResult {
  isValid: boolean;
  message: string;
  type: 'error' | 'success' | 'info';
}

export const useFormValidation = () => {
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});

  const validateField = useCallback((fieldName: string, value: string, rules: ValidationRules) => {
    let result: ValidationResult = { isValid: true, message: '', type: 'success' };

    if (fieldName === 'email' && rules.email) {
      if (rules.email.required && !value) {
        result = { isValid: false, message: 'Email is required', type: 'error' };
      } else if (value && rules.email.pattern && !rules.email.pattern.test(value)) {
        result = { isValid: false, message: 'Please enter a valid email address', type: 'error' };
      } else if (value && rules.email.pattern && rules.email.pattern.test(value)) {
        result = { isValid: true, message: 'Valid email address', type: 'success' };
      }
    }

    if (fieldName === 'password' && rules.password) {
      if (rules.password.required && !value) {
        result = { isValid: false, message: 'Password is required', type: 'error' };
      } else if (value) {
        const issues = [];
        
        if (rules.password.minLength && value.length < rules.password.minLength) {
          issues.push(`at least ${rules.password.minLength} characters`);
        }
        if (rules.password.requireNumber && !/\d/.test(value)) {
          issues.push('a number');
        }
        if (rules.password.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          issues.push('a special character');
        }
        if (rules.password.requireUppercase && !/[A-Z]/.test(value)) {
          issues.push('an uppercase letter');
        }
        if (rules.password.requireLowercase && !/[a-z]/.test(value)) {
          issues.push('a lowercase letter');
        }

        if (issues.length > 0) {
          result = { 
            isValid: false, 
            message: `Password needs ${issues.join(', ')}`, 
            type: 'error' 
          };
        } else {
          result = { isValid: true, message: 'Strong password', type: 'success' };
        }
      }
    }

    setValidationResults(prev => ({
      ...prev,
      [fieldName]: result
    }));

    return result;
  }, []);

  const getValidationResult = useCallback((fieldName: string) => {
    return validationResults[fieldName];
  }, [validationResults]);

  const clearValidation = useCallback((fieldName?: string) => {
    if (fieldName) {
      setValidationResults(prev => {
        const { [fieldName]: removed, ...rest } = prev;
        return rest;
      });
    } else {
      setValidationResults({});
    }
  }, []);

  return {
    validateField,
    getValidationResult,
    clearValidation,
  };
};
