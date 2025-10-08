import { Route, Routes, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
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
import { APP_ROUTES } from '@/constants/routes';

const DevMutationPlayground = lazy(() => import('@/dev/DevMutationPlayground'));
const DevProducts = lazy(() => import('@/features/products/components'));
const DevProfile = lazy(() => import('@/dev/Profile'));

const LOGIN_BACKGROUND_IMAGE = images.loginImg;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas de desarrollo */}
      {import.meta.env.DEV && (
        <>
          <Route
            path={APP_ROUTES.DEV_MUTATION}
            element={<Suspense fallback={<div>Cargando...</div>}><DevMutationPlayground /></Suspense>}
          />
          <Route
            path={APP_ROUTES.DEV_PRODUCTS}
            element={<Suspense fallback={<div>Cargando...</div>}><DevProducts /></Suspense>}
          />
          <Route
            path={APP_ROUTES.DEV_PROFILE}
            element={<Suspense fallback={<div>Cargando...</div>}><DevProfile /></Suspense>}
          />
        </>
      )}

      {/* Rutas públicas */}
      <Route
        path={APP_ROUTES.LOGIN}
        element={<LoginPage backgroundImage={LOGIN_BACKGROUND_IMAGE} />}
      />
      <Route path={APP_ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

      {/* Rutas protegidas */}
      <Route
        path={APP_ROUTES.HOME}
        element={<ProtectedRoute permiso={PERMISSIONS.HOME_DASHBOARD_VIEW}><Home /></ProtectedRoute>}
      />
      <Route
        path={APP_ROUTES.KANBAN}
        element={<ProtectedRoute permiso={PERMISSIONS.KANBAN_BOARD_VIEW}><Kanban /></ProtectedRoute>}
      />
      <Route
        path={APP_ROUTES.FORMS_DEMO}
        element={<ProtectedRoute><FormLayoutDemo /></ProtectedRoute>}
      />

      {/* Seguridad */}
      <Route
        path={APP_ROUTES.SECURITY}
        element={<ProtectedRoute permiso={PERMISSIONS.SECURITY_OVERVIEW_VIEW}><Seguridad /></ProtectedRoute>}
      >
        <Route index element={<Navigate to={APP_ROUTES.SECURITY_USERS} replace />} />
        <Route
          path='usuarios'
          element={<ProtectedRoute permiso={PERMISSIONS.SECURITY_USERS_VIEW}><UsuariosPage /></ProtectedRoute>}
        />
        <Route
          path='roles'
          element={<ProtectedRoute permiso={PERMISSIONS.SECURITY_ROLES_VIEW}><RolesPage /></ProtectedRoute>}
        />
        <Route
          path='permisos'
          element={<ProtectedRoute permiso={PERMISSIONS.SECURITY_PERMISSIONS_VIEW}><PermissionsPage /></ProtectedRoute>}
        />
      </Route>

      {/* Redirecciones y placeholders */}
      <Route path={APP_ROUTES.ROOT} element={<Navigate to={APP_ROUTES.HOME} replace />} />
      <Route path={APP_ROUTES.REGISTER} element={<h2>Página de Registro (futuro)</h2>} />
      <Route path={APP_ROUTES.FORGOT_PASSWORD} element={<h2>Recuperar Contraseña (futuro)</h2>} />
    </Routes>
  );
};

export default AppRoutes;
