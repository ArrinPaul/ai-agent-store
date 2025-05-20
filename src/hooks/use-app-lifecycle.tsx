
import { useEffect, useState } from 'react';

export function useAppLifecycle() {
  const [isActive, setIsActive] = useState(true);
  const [lastActiveTime, setLastActiveTime] = useState<Date>(new Date());
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsActive(true);
        setLastActiveTime(new Date());
      } else {
        setIsActive(false);
      }
    };
    
    // For browser visibility
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // For mobile app pause/resume
    document.addEventListener('pause', () => {
      setIsActive(false);
    });
    
    document.addEventListener('resume', () => {
      setIsActive(true);
      setLastActiveTime(new Date());
    });
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('pause', () => setIsActive(false));
      document.removeEventListener('resume', () => {
        setIsActive(true);
        setLastActiveTime(new Date());
      });
    };
  }, []);
  
  return {
    isActive,
    lastActiveTime,
    inactiveTime: isActive ? 0 : Math.floor((new Date().getTime() - lastActiveTime.getTime()) / 1000),
  };
}
