import React from 'react';

import { Route, Routes, Navigate } from 'react-router-dom'; // Importa Navigate
import { useAuthStore } from '@/store/authStore'; // Importa el store de auten

import Home from '@/pages/Home'; //
import Kanban from '@/pages/Kanban';
import Roles from '@/pages/Roles';
import Users from '@/pages/Users';
import Permissions from '@/pages/Permissions';
import Project from '@/pages/Project';
import DashProject from '@/pages/DashProject';
import LoginPage from '@/pages/LoginPage'; // Importa la página de Login
import Administracion from '@/pages/Administracion';
import PermisosPage from '@/pages/Administracion/Permisos';
import UsuariosPage from '@/pages/Administracion/Users';
import RolesPage from '@/pages/Administracion/Roles';

const LOGIN_BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop';

// ✅ 1. Define el tipo para las props de ProtectedRoute.
//    Espera recibir un 'React.ReactNode', que es el tipo para cualquier
//    elemento JSX que pueda ser renderizado.
interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ✅ 2. Aplica el tipo al componente.
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // ✅ 3. 'isLoggedIn' es inferido como 'boolean' gracias a nuestro store tipado.
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta de Login (será la página de inicio por defecto) */}
      <Route
        path="/login"
        element={<LoginPage backgroundImage={LOGIN_BACKGROUND_IMAGE} />}
      />
      {/* Rutas Protegidas (solo accesibles si el usuario está logueado) */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />{' '}
      {/* 👈 2. Añade la ruta para Home */}
      <Route
        path="/kanban"
        element={
          <ProtectedRoute>
            <Kanban />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/roles"
        element={
          <ProtectedRoute>
            <Roles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/permisos"
        element={
          <ProtectedRoute>
            <Permissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project"
        element={
          <ProtectedRoute>
            <Project />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashproject"
        element={
          <ProtectedRoute>
            <DashProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/administracion"
        element={
          <ProtectedRoute>
            <Administracion />
          </ProtectedRoute>
        }
      />
      <Route
        path="/administracion/roles"
        element={
          <ProtectedRoute>
            <RolesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/administracion/usuarios"
        element={
          <ProtectedRoute>
            <UsuariosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/administracion/permisos"
        element={
          <ProtectedRoute>
            <PermisosPage />
          </ProtectedRoute>
        }
      />
      {/* Redirigir la ruta raíz a /login si no está logueado, o a /kanban si sí */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      {/* Opcional: Rutas para registro o recuperar contraseña */}
      <Route path="/register" element={<h2>Página de Registro (futuro)</h2>} />
      <Route
        path="/forgot-password"
        element={<h2>Recuperar Contraseña (futuro)</h2>}
      />
    </Routes>
  );
};

export default AppRoutes;
