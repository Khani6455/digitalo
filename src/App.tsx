
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductProvider } from "./contexts/ProductContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ProductProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Index />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Keep admin dashboard accessible via direct URL */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ProductProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
