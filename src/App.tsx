
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Redirect from "./pages/Redirect";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// This function detects if we're accessing a shortened URL 
// without the hash and redirects to the proper route
const handleShortUrlAccess = () => {
  const path = window.location.pathname;
  
  // Only process if it's not the root and doesn't start with a hash
  if (path !== "/" && !window.location.hash) {
    // Extract the alias from the path (remove leading slash)
    const alias = path.substring(1);
    
    // Redirect to the proper hash route
    window.location.href = `${window.location.origin}/#/${alias}`;
    return true;
  }
  
  return false;
};

const App = () => {
  useEffect(() => {
    // Check if we need to handle a short URL on initial load
    handleShortUrlAccess();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/:alias" element={<Redirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
