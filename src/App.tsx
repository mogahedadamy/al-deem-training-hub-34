import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LearningProvider } from "@/contexts/LearningContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SupabaseProtectedRoute } from "@/components/auth/SupabaseProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CourseDetail from "./pages/CourseDetail";
import LessonView from "./pages/LessonView";
import ExamPage from "./pages/ExamPage";
import AuthPage from "./pages/AuthPage";
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
      <AuthProvider>
        <PaymentProvider>
          <NotificationProvider>
            <LearningProvider>
              <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <NotificationManager />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route 
                path="/course/:courseId/lesson/:lessonId" 
                element={
                  <ProtectedRoute>
                    <LessonView />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/course/:courseId/exam" 
                element={
                  <ProtectedRoute>
                    <ExamPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/auth" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <AuthPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/auth-supabase" 
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
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/load-testing" 
                element={
                  <ProtectedRoute>
                    <LoadTesting />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payment/:courseId" 
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
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
                  <ProtectedRoute>
                    <MyPayments />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
          </LearningProvider>
        </NotificationProvider>
      </PaymentProvider>
    </AuthProvider>
  </SupabaseAuthProvider>
</QueryClientProvider>
);

export default App;
