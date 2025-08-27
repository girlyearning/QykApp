import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Capacitor } from '@capacitor/core';
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useUserSettings } from "@/hooks/useUserSettings";
import { AuthProvider } from "@/contexts/AuthContext";
import { useBackButton } from "@/hooks/useBackButton";
import { useKeyboard } from "@/hooks/useKeyboard";
import Index from "./pages/Index";
import QykNote from "./pages/QykNote";
import QykWrite from "./pages/QykWrite";
import QykFess from "./pages/QykFess";
import QykNoteFolders from "./pages/QykNoteFolders";
import QykWriteFolders from "./pages/QykWriteFolders";
import QykFessFolders from "./pages/QykFessFolders";
import Settings from "./pages/Settings";
import ThemePicker from "./pages/ThemePicker";
import QykQuestions from "./pages/QykQuestions";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const { settings } = useUserSettings();
  useKeyboard();

  // Handle hardware back button
  useBackButton();

  // Apply font scale only when it changes to avoid reflow thrash on re-renders
  useEffect(() => {
    const root = document.documentElement;
    // Prefer server setting; fall back to previously persisted local value to avoid initial flash
    const rawLocal = (() => {
      try { return window.localStorage?.getItem('qyk_font_scale') || undefined; } catch { return undefined; }
    })();
    const pref = (settings.font_scale ?? (rawLocal as any)) as 'small' | 'default' | 'large' | 'xlarge' | 'smallest' | undefined;
    const scale = pref === 'smallest' ? 'small' : (pref ?? 'default');

    const classes = ["font-scale-small", "font-scale-default", "font-scale-large", "font-scale-xlarge"];
    for (const cls of classes) root.classList.remove(cls);
    root.classList.add(
      scale === "small"
        ? "font-scale-small"
        : scale === "large"
        ? "font-scale-large"
        : scale === "xlarge"
        ? "font-scale-xlarge"
        : "font-scale-default"
    );
    // Toggle home-screen-only minus-one for Default scale on the Index route
    const onHome = location.pathname === "/";
    if (onHome && scale === "default") root.classList.add("home-default-minus-one");
    else root.classList.remove("home-default-minus-one");
  }, [settings.font_scale, location.pathname]);
  return (
    <div className={`min-h-screen bg-background pt-safe`}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qyk-note"
          element={
            <ProtectedRoute>
              <QykNote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qyk-note-folders"
          element={
            <ProtectedRoute>
              <QykNoteFolders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qyk-write"
          element={
            <ProtectedRoute>
              <QykWrite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qyk-write-folders"
          element={
            <ProtectedRoute>
              <QykWriteFolders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qyk-fess"
          element={
            <ProtectedRoute>
              <QykFess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qyk-questions"
          element={
            <ProtectedRoute>
              <QykQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qyk-fess-folders"
          element={
            <ProtectedRoute>
              <QykFessFolders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/theme"
          element={
            <ProtectedRoute>
              <ThemePicker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  // Use HashRouter for native (Capacitor) AND standalone PWA installs
  // Standalone PWA detection: display-mode media query or iOS navigator.standalone
  const isStandalonePWA =
    typeof window !== "undefined" &&
    ((window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      (navigator as any).standalone === true);

  const Router = (Capacitor.isNativePlatform() || isStandalonePWA)
    ? HashRouter
    : BrowserRouter;
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <AppContent />
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
