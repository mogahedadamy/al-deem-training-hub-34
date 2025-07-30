import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { LearningProvider } from "@/contexts/LearningContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import { SupabaseProtectedRoute } from "@/components/auth/SupabaseProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CourseDetail from "./pages/CourseDetail";
import LessonView from "./pages/LessonView";
import ExamPage from "./pages/ExamPage";

import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import LoadTesting from "./pages/LoadTesting";
import PaymentPage from "./pages/PaymentPage";
import AdminPayments from "./pages/AdminPayments";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MyPayments from "./pages/MyPayments";
import AuthSupabase from "./pages/AuthSupabase";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { NotificationManager } from "./components/notifications/NotificationManager";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
        <PaymentProvider>
          <NotificationProvider>
            <LearningProvider>
              <TooltipProvider>
          <Toaster />
          <Sonner />
            <NotificationManager />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route 
                path="/course/:courseId/lesson/:lessonId" 
                element={
                  <SupabaseProtectedRoute>
                    <LessonView />
                  </SupabaseProtectedRoute>
                } 
              />
              <Route 
                path="/course/:courseId/exam" 
                element={
                  <SupabaseProtectedRoute>
                    <ExamPage />
                  </SupabaseProtectedRoute>
                } 
              />
              <Route 
                path="/auth" 
                element={
                  <SupabaseProtectedRoute requireAuth={false}>
                    <AuthSupabase />
                  </SupabaseProtectedRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <SupabaseProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </SupabaseProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <SupabaseProtectedRoute>
                    <Profile />
                  </SupabaseProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <SupabaseProtectedRoute>
                    <Dashboard />
                  </SupabaseProtectedRoute>
                } 
              />
              <Route 
                path="/load-testing" 
                element={
                  <SupabaseProtectedRoute>
                    <LoadTesting />
                  </SupabaseProtectedRoute>
                } 
              />
              <Route 
                path="/payment/:courseId" 
                element={
                  <SupabaseProtectedRoute>
                    <PaymentPage />
                  </SupabaseProtectedRoute>
                } 
              />
              <Route 
                path="/admin/login" 
                element={<AdminLogin />} 
              />
              <Route 
                path="/admin/payments" 
                element={
                  <AdminProtectedRoute>
                    <AdminPayments />
                  </AdminProtectedRoute>
                } 
              />
              <Route 
                path="/my-payments" 
                element={
                  <SupabaseProtectedRoute>
                    <MyPayments />
                  </SupabaseProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
          </LearningProvider>
        </NotificationProvider>
      </PaymentProvider>
  </SupabaseAuthProvider>
</QueryClientProvider>
);

export default App;
