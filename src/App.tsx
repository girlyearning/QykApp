import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import QykNote from "./pages/QykNote";
import QykWrite from "./pages/QykWrite";
import QykFess from "./pages/QykFess";
import QykNoteFolders from "./pages/QykNoteFolders";
import QykWriteFolders from "./pages/QykWriteFolders";
import QykFessFolders from "./pages/QykFessFolders";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import BottomNavigation from "./components/BottomNavigation";
import TopNavigation from "./components/TopNavigation";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isHomePage = location.pathname === '/';

  return (
    <>
      <TopNavigation />
      {!isAuthPage && isHomePage && <BottomNavigation />}
      <div className={!isHomePage && !isAuthPage ? 'pt-16' : ''}>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/qyk-note" element={<ProtectedRoute><QykNote /></ProtectedRoute>} />
          <Route path="/qyk-write" element={<ProtectedRoute><QykWrite /></ProtectedRoute>} />
          <Route path="/qyk-fess" element={<ProtectedRoute><QykFess /></ProtectedRoute>} />
          <Route path="/qyk-note-folders" element={<ProtectedRoute><QykNoteFolders /></ProtectedRoute>} />
          <Route path="/qyk-write-folders" element={<ProtectedRoute><QykWriteFolders /></ProtectedRoute>} />
          <Route path="/qyk-fess-folders" element={<ProtectedRoute><QykFessFolders /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
