
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const AuthSkeleton = () => {
  return (
    <motion.div
      className="w-full max-w-md p-6 sm:p-8 glass-effect rounded-xl shadow-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header skeleton */}
      <Skeleton className="h-8 w-3/4 mx-auto mb-8" />
      
      {/* Form fields skeleton */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        
        {/* Button skeleton */}
        <Skeleton className="h-10 w-full" />
        
        {/* Forgot password skeleton */}
        <Skeleton className="h-6 w-32 mx-auto" />
      </div>
      
      {/* Divider skeleton */}
      <div className="mt-6 mb-6">
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-4 w-24 mx-auto mt-2" />
      </div>
      
      {/* Social buttons skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      {/* Toggle skeleton */}
      <div className="mt-6">
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-4 w-40 mx-auto mt-2" />
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </motion.div>
  );
};

export default AuthSkeleton;
