
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// PWA registration in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      registration => {
        console.log('SW registered:', registration);
      },
      err => {
        console.log('SW registration failed:', err);
      }
    );
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

createRoot(document.getElementById("root")!).render(<App />);
