// src/routes/AppRoutes.tsx
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Kanban from '@/pages/Kanban';
import Project from '@/pages/Project';
import DashProject from '@/pages/DashProject';
import LoginPage from '@/features/auth/LoginPage';
import Seguridad from '@/pages/Security';
import PermisosPage from '@/pages/Security/Permisos';
import UsuariosPage from '@/pages/Security/Users';
import RolesPage from '@/pages/Security/Roles';
import ContactoPage from '@/pages/Contacto/ContactoPage';
import Unauthorized from '@/pages/Unauthorized';
import FormLayoutDemo from '@/pages/FormsDemo/FormLayoutDemo';
import ProtectedRoute from './ProtectedRoute';
import { RoutePermissions as RP } from '@/constants/routePermissions';

// 🔸 Se mantiene el fondo de Login para pasarlo como prop
const LOGIN_BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Públicas */}
      <Route
        path="/login"
        element={<LoginPage backgroundImage={LOGIN_BACKGROUND_IMAGE} />}
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protegidas */}
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
          <ProtectedRoute permiso={RP.KANBAN_VIEW}>
            <Kanban />
          </ProtectedRoute>
        }
      />

      <Route
        path="/project"
        element={
          <ProtectedRoute permiso={RP.PROJECT_VIEW}>
            <Project />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashproject"
        element={
          <ProtectedRoute permiso={RP.DASHPROJECT_VIEW}>
            <DashProject />
          </ProtectedRoute>
        }
      />

      <Route
        path="/forms-demo"
        element={
          <ProtectedRoute>
            <FormLayoutDemo />
          </ProtectedRoute>
        }
      />

      {/* Seguridad: anidar subrutas para que se rendericen dentro de <Seguridad /> via <Outlet /> */}
      <Route
        path="/seguridad"
        element={
          <ProtectedRoute permiso={RP.SEGU_VIEW}>
            <Seguridad />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="usuarios" replace />} />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute permiso={RP.SEGU_USERS_VIEW}>
              <UsuariosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute permiso={RP.SEGU_ROLES_VIEW}>
              <RolesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="permisos"
          element={
            <ProtectedRoute permiso={RP.SEGU_PERMISSIONS_VIEW}>
              <PermisosPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/contacto"
        element={
          <ProtectedRoute permiso={RP.CONTACTO_VIEW}>
            <ContactoPage />
          </ProtectedRoute>
        }
      />

      {/* Redirects / placeholders */}
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
