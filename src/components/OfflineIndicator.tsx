
import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Handle online status changes
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You are back online!");
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline. Some features may not work.");
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection status periodically
    const intervalId = setInterval(() => {
      fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache'
      })
        .then(() => {
          if (!isOnline) setIsOnline(true);
        })
        .catch(() => {
          if (isOnline) setIsOnline(false);
        });
    }, 30000); // Check every 30 seconds

    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [isOnline]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div 
          className="fixed bottom-20 z-50 left-0 right-0 flex justify-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring" }}
        >
          <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm">You are currently offline</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;
