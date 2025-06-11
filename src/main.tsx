
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// PWA registration in production
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      registration => {
        console.log('SW registered:', registration);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 1000 * 60 * 60); // Check every hour
      },
      err => {
        console.log('SW registration failed:', err);
      }
    );
    
    // Listen for new service workers
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // The service worker has taken control, reload for fresh content
      if (document.hidden) {
        // Only reload when the page is hidden to not interrupt the user
        window.location.reload();
      }
    });
  });
}

// Add support for Capacitor if it's available
const isCapacitor = window.location.href.includes('capacitor://');
if (isCapacitor) {
  // Apply Capacitor-specific settings here
  document.documentElement.classList.add('capacitor');
  
  // Listen for app resume
  document.addEventListener('resume', () => {
    // Check for updates on app resume
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CHECK_FOR_UPDATES' });
    }
  });
}

// Mobile app gestures setup
let touchStartX = 0;
let touchEndX = 0;

window.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

window.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipeGesture();
});

const handleSwipeGesture = () => {
  const threshold = 100;
  // Detect left and right swipes
  if (touchEndX - touchStartX > threshold) {
    // Swipe right - potentially go back
    window.history.back();
  } else if (touchStartX - touchEndX > threshold) {
    // Swipe left - potentially go forward
    // This can be customized based on your app's navigation
  }
};

// For iOS to use the correct vh
const setIOSHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

window.addEventListener('resize', setIOSHeight);
window.addEventListener('orientationchange', setIOSHeight);
setIOSHeight();

// Initialize the app with StrictMode to catch React issues early
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
