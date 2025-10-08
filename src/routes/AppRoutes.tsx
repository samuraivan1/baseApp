// src/routes/AppRoutes.tsx
import { Route, Routes, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import { Home } from '@/features/home';
import { Kanban } from '@/features/kanban';
import { LoginPage } from '@/features/auth';
import {
  Seguridad,
  UsuariosPage,
  RolesPage,
  PermissionsPage,
} from '@/features/security';
import { Unauthorized } from '@/features/shell';
import { FormLayoutDemo } from '@/features/demo';
import ProtectedRoute from './ProtectedRoute';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import { images } from '@/assets/images';

// 🔸 Se mantiene el fondo de Login para pasarlo como prop
const LOGIN_BACKGROUND_IMAGE = images.loginImg;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta de playground solo en desarrollo */}
      {import.meta.env.DEV && (
        <Route
          path="/dev/mutation"
          element={
            <Suspense fallback={<div style={{ padding: 24 }}>Cargando playground…</div>}>
              {React.createElement(React.lazy(() => import('@/dev/DevMutationPlayground')))}
            </Suspense>
          }
        />
      )}
      {import.meta.env.DEV && (
        <Route
          path="/dev/products"
          element={
            <Suspense fallback={<div style={{ padding: 24 }}>Cargando products…</div>}>
              {React.createElement(React.lazy(() => import('@/features/products/components')))}
            </Suspense>
          }
        />
      )}
      {import.meta.env.DEV && (
        <Route
          path="/dev/profile"
          element={
            <Suspense fallback={<div style={{ padding: 24 }}>Cargando perfil…</div>}>
              {React.createElement(React.lazy(() => import('@/dev/Profile')))}
            </Suspense>
          }
        />
      )}
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
          <ProtectedRoute permiso={PERMISSIONS.HOME_DASHBOARD_VIEW}>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/kanban"
        element={
          <ProtectedRoute permiso={PERMISSIONS.KANBAN_BOARD_VIEW}>
            <Kanban />
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
          <ProtectedRoute permiso={PERMISSIONS.SECURITY_OVERVIEW_VIEW}>
            <Seguridad />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="usuarios" replace />} />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute permiso={PERMISSIONS.SECURITY_USERS_VIEW}>
              <UsuariosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute permiso={PERMISSIONS.SECURITY_ROLES_VIEW}>
              <RolesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="permisos"
          element={
            <ProtectedRoute permiso={PERMISSIONS.SECURITY_PERMISSIONS_VIEW}>
              <PermissionsPage />
            </ProtectedRoute>
          }
        />
      </Route>

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
