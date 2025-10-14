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
  const { isLoggedIn, phase, hasPermission } = useAuthStore((s) => ({
    isLoggedIn: s.isLoggedIn,
    phase: (s as any).phase ?? (s.authReady ? 'ready' : 'idle'),
    hasPermission: s.hasPermission,
  }));

  // Espera a que el estado de auth esté listo para evitar redirecciones prematuras
  if (phase !== 'ready') return null;

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
    // Log de diagnóstico no bloqueante
    try {
      console.warn('[Route Guard] Missing permission', { permiso, pathname: location.pathname });
    } catch {
      // noop
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
