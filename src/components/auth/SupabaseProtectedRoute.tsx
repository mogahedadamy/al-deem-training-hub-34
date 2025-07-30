import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { LoadingOptimizer } from '@/components/performance/LoadingOptimizer';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'instructor' | 'student';
  redirectTo?: string;
}

export const SupabaseProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  redirectTo = '/auth-supabase'
}) => {
  const { state, hasRole } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (state.isLoading) {
    return <LoadingOptimizer />;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !state.isAuthenticated) {
    // Save the current location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but trying to access auth pages
  if (!requireAuth && state.isAuthenticated) {
    // Redirect to dashboard or the intended page
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Check role requirements
  if (requiredRole && state.isAuthenticated && !hasRole(requiredRole)) {
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};