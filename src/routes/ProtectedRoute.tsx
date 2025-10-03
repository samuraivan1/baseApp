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
  const { isLoggedIn, authReady, hasPermission } = useAuthStore((s) => ({
    isLoggedIn: s.isLoggedIn,
    authReady: s.authReady,
    hasPermission: s.hasPermission,
  }));

  // Espera a que el estado de auth esté listo para evitar redirecciones prematuras
  if (!authReady) return null;

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
