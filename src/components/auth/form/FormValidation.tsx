
import React from 'react';
import { AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ValidationMessageProps {
  message: string;
  type: 'error' | 'success' | 'info';
  show: boolean;
}

const ValidationMessage = ({ message, type, show }: ValidationMessageProps) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-2 text-sm ${getTextColor()}`}
        >
          {getIcon()}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ValidationMessage;
