import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { state, hasRole } = useAuth();

  if (!state.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect admins to admin dashboard
  if (hasRole('admin')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <StudentDashboard />;
}