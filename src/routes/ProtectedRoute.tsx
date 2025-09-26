// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  permiso?: string; // si no se pasa, basta con estar logueado
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permiso,
  children,
}) => {
  const { isLoggedIn, hasPermission } = useAuthStore((s) => ({
    isLoggedIn: s.isLoggedIn,
    hasPermission: s.hasPermission,
  }));

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (permiso !== undefined && !hasPermission(permiso)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
