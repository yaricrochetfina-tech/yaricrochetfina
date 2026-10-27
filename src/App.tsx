import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Collections = lazy(() => import("./pages/Collections"));
import { Header } from "@/components/Header";
import { ShoppingCart } from "@/components/ShoppingCart";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import "./i18n/config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** Al cambiar de página se vuelve arriba (salvo que la URL lleve un #ancla). */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster richColors closeButton />
          <BrowserRouter>
            <ScrollToTop />
            <Header />
            <ShoppingCart />
            <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/colecciones" element={<Collections />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/envios" element={<ShippingPolicy />} />
              <Route path="/terminos" element={<Terms />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
              {/* AÑADE TODAS LAS RUTAS PERSONALIZADAS ENCIMA DE LA RUTA COMODÍN "*" */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
