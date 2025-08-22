import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QykNote from "./pages/QykNote";
import QykWrite from "./pages/QykWrite";
import QykFess from "./pages/QykFess";
import NotFound from "./pages/NotFound";
import BottomNavigation from "./components/BottomNavigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <div className="relative">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/qyknote" element={<QykNote />} />
          <Route path="/qykwrite" element={<QykWrite />} />
          <Route path="/qykfess" element={<QykFess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNavigation />
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
