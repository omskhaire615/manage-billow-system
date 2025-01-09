import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Billing from "@/pages/Billing";
import React from 'react';
import { ProductProvider } from "@/contexts/ProductContext";
import { useIsMobile } from "@/hooks/use-mobile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const isMobile = useIsMobile();

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ProductProvider>
          <TooltipProvider>
            <BrowserRouter>
              <div className="flex min-h-screen bg-gray-50">
                <Navigation />
                <main className={`flex-1 p-4 md:p-8 animate-fadeIn ${isMobile ? 'ml-0' : 'ml-64'}`}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/billing" element={<Billing />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
            <Toaster />
            <SonnerToaster />
          </TooltipProvider>
        </ProductProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;