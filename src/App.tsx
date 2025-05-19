
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MobileAppProvider } from "@/contexts/MobileAppContext";
import PrivateRoute from "@/components/PrivateRoute";
import MobileAppShell from "@/components/MobileAppShell";

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
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <UserProfileProvider>
              <MobileAppProvider>
                <TooltipProvider>
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
                </TooltipProvider>
              </MobileAppProvider>
            </UserProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
