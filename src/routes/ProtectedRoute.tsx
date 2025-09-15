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
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (permiso !== undefined) {
    const tienePermiso = user?.permisos?.some((p) => String(p) === permiso);
    if (!tienePermiso) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Renderizar children si existen, de lo contrario Outlet (para rutas anidadas)
  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
