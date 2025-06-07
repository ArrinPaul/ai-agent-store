
import React from 'react';
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface AuthSuccessAnimationProps {
  message: string;
  show: boolean;
}

const AuthSuccessAnimation = ({ message, show }: AuthSuccessAnimationProps) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-card p-8 rounded-xl shadow-lg border flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-semibold text-center"
        >
          {message}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default AuthSuccessAnimation;
