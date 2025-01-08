import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Billing from "@/pages/Billing";
import React from 'react';
import { ProductProvider } from "@/contexts/ProductContext";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ProductProvider>
          <TooltipProvider>
            <BrowserRouter>
              <div className="flex min-h-screen bg-gray-50">
                <Navigation />
                <main className="flex-1 ml-64 p-8 animate-fadeIn">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/billing" element={<Billing />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </ProductProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;