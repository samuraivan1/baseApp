// src/routes/AppRoutes.tsx
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Kanban from '@/pages/Kanban';
import Project from '@/pages/Project';
import DashProject from '@/pages/DashProject';
import LoginPage from '@/pages/LoginPage';
import Administracion from '@/pages/Administracion';
import PermisosPage from '@/pages/Administracion/Permisos';
import UsuariosPage from '@/pages/Administracion/Users';
import RolesPage from '@/pages/Administracion/Roles';
import ContactoPage from '@/pages/Contacto/ContactoPage';
import ProtectedRoute from './ProtectedRoute';

const LOGIN_BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage backgroundImage={LOGIN_BACKGROUND_IMAGE} />}
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/kanban"
        element={
          <ProtectedRoute permiso="page:kanban:view">
            <Kanban />
          </ProtectedRoute>
        }
      />

      <Route
        path="/project"
        element={
          <ProtectedRoute permiso="page:project:view">
            <Project />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashproject"
        element={
          <ProtectedRoute permiso="page:dashproject:view">
            <DashProject />
          </ProtectedRoute>
        }
      />

      <Route
        path="/administracion"
        element={
          <ProtectedRoute permiso="page:administracion:view">
            <Administracion />
          </ProtectedRoute>
        }
      />

      <Route
        path="/administracion/roles"
        element={
          <ProtectedRoute permiso="page:administracion_roles:view">
            <RolesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/administracion/usuarios"
        element={
          <ProtectedRoute permiso="page:administracion_usuarios:view">
            <UsuariosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/administracion/permisos"
        element={
          <ProtectedRoute permiso="page:administracion_permisos:view">
            <PermisosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contacto"
        element={
          <ProtectedRoute permiso="page:contacto:view">
            <ContactoPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/register" element={<h2>Página de Registro (futuro)</h2>} />
      <Route
        path="/forgot-password"
        element={<h2>Recuperar Contraseña (futuro)</h2>}
      />
    </Routes>
  );
};

export default AppRoutes;
