
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
// and redirects to the proper route
const handleShortUrlAccess = () => {
  const path = window.location.pathname;
  
  // Only process if it's not the root and doesn't start with a hash
  if (path !== "/" && !window.location.hash) {
    // Extract the alias from the path (remove leading slash)
    const alias = path.substring(1);
    
    // Check if we're on the actual lw.lovable.app domain
    if (window.location.hostname === "lw.lovable.app") {
      // Redirect to the proper hash route on the main app
      window.location.href = `https://link-whisper-alias-maker.lovable.app/#/${alias}`;
      return true;
    } else {
      // If we're on the main app domain but accessing a direct path
      window.location.href = `${window.location.origin}/#/${alias}`;
      return true;
    }
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
