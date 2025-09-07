import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useTracking } from '@/context/TrackingContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdmin } = useTracking();

  // Allow some time for localStorage to be read on page refresh
  useEffect(() => {
    // This ensures the component re-renders after localStorage is read
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
