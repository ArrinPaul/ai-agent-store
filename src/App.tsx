
import React, { Suspense, lazy } from "react";
const { useEffect } = React;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MobileAppProvider } from "@/contexts/MobileAppContext";
import PrivateRoute from "@/components/PrivateRoute";
import MobileAppShell from "@/components/MobileAppShell";
import "./App.css";

// Lazy loaded components
const Auth = lazy(() => import("./pages/Auth"));
const Index = lazy(() => import("./pages/Index"));
const Profile = lazy(() => import("./pages/Profile"));
const Apps = lazy(() => import("./pages/Apps"));
const AppPreview = lazy(() => import("./pages/AppPreview"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center space-y-4">
      <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      <p className="text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  // Handle platform-specific behaviors
  useEffect(() => {
    // Check if running on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      document.documentElement.classList.add('ios');
    }
    
    // Check if running on Android
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      document.documentElement.classList.add('android');
    }
    
    // Check if running as installed PWA
    const isStandalone = 'standalone' in window.navigator && (window.navigator as any).standalone === true;
    const displayMode = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone || displayMode) {
      document.documentElement.classList.add('standalone-pwa');
    }
    
    // Add class for capacitor
    if (window.location.href.includes('capacitor://')) {
      document.documentElement.classList.add('capacitor-app');
    }
    
    // Handle app back button for Android
    document.addEventListener('backbutton', (e) => {
      // Prevent default behavior
      e.preventDefault();
      
      // Custom back behavior
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // If no history, show exit confirmation
        if (confirm("Do you want to exit the app?")) {
          // In a real Capacitor app, we would use App.exitApp()
          // For PWA, we can't actually exit
          console.log("Exit app requested");
        }
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <UserProfileProvider>
              <MobileAppProvider>
                <div className="min-h-screen flex w-full">
                  <Toaster />
                  <Sonner position="top-right" closeButton richColors />
                  <MobileAppShell>
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/auth" element={<Auth />} />
                        <Route
                          path="/"
                          element={
                            <PrivateRoute>
                              <Index />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <PrivateRoute>
                              <Profile />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/apps"
                          element={
                            <PrivateRoute>
                              <Apps />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/apps/bookmarks"
                          element={
                            <PrivateRoute>
                              <Apps />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/apps/:appId"
                          element={
                            <PrivateRoute>
                              <AppPreview />
                            </PrivateRoute>
                          }
                        />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </MobileAppShell>
                </div>
              </MobileAppProvider>
            </UserProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
