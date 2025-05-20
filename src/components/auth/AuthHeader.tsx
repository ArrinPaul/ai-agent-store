
import { motion } from "framer-motion";
import React from "react";

interface AuthHeaderProps {
  title: string;
}

const AuthHeader = ({ title }: AuthHeaderProps) => {
  return (
    <motion.h1 
      className="text-2xl sm:text-3xl font-bold text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {title}
    </motion.h1>
  );
};

export default AuthHeader;
