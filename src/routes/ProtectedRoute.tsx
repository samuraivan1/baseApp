// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/shell/state/authStore';

interface ProtectedRouteProps {
  permiso?: string; // si no se pasa, basta con estar logueado
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permiso,
  children,
}) => {
  const location = useLocation();
  const { isLoggedIn, hasPermission } = useAuthStore((s) => ({
    isLoggedIn: s.isLoggedIn,
    hasPermission: s.hasPermission,
  }));

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (permiso !== undefined && !hasPermission(permiso)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
