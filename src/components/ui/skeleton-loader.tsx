
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/60",
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <motion.div 
      className="border rounded-xl p-4 space-y-3 shimmer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Skeleton className="h-40 w-full rounded-md" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </motion.div>
  );
}

export function FeaturedSkeletonLoader() {
  return (
    <motion.div 
      className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl md:rounded-3xl bg-gradient-to-br from-muted/60 to-muted/30 shimmer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 md:h-14 w-3/4" />
        <Skeleton className="h-5 w-full max-w-lg" />
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

export function GridSkeletonLoader({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(count).fill(0).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
