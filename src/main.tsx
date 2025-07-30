import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import { LearningProgressProvider } from "@/contexts/LearningProgressContext";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SupabaseAuthProvider>
          <PaymentProvider>
            <LearningProgressProvider>
              <App />
              <Toaster />
            </LearningProgressProvider>
          </PaymentProvider>
        </SupabaseAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
