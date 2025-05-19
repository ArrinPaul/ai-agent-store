
import { useState, useEffect, useCallback, memo } from "react";
import { WifiOff } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const OfflineIndicator = memo(() => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Move the check connection function outside useEffect for reusability
  const checkConnection = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      await fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      if (!isOnline) setIsOnline(true);
    } catch (error) {
      if (isOnline) setIsOnline(false);
    }
  }, [isOnline]);

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

    // Check connection status periodically with a more efficient interval
    const intervalId = setInterval(checkConnection, 30000);

    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [isOnline, checkConnection]);

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
});

OfflineIndicator.displayName = "OfflineIndicator";

export default OfflineIndicator;
