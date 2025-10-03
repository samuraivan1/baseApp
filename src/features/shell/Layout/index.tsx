import React from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import './Layout.scss';
import { useAuthStore } from '@/features/shell/state/authStore';
import { useIdleLogout } from '@/shared/auth/useIdleLogout';
import SecurityHeadersCheck from '@/shared/components/dev/SecurityHeadersCheck';

const Layout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const contentClassName = `layout__content ${isLoginPage ? 'layout__content--login' : ''}`;

  const { authReady } = useAuthStore();
  useIdleLogout();

  return (
    <div className="layout">
      {!isLoginPage && <Header />}
      <main className={contentClassName}>
        {!authReady ? (
          <div style={{ display: 'grid', placeItems: 'center', minHeight: '40vh' }}>
            <div style={{ textAlign: 'center', color: '#666' }}>Restaurando sesión…</div>
          </div>
        ) : (
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        )}
      </main>
      {!isLoginPage && <Footer />}
      {import.meta.env.DEV && <SecurityHeadersCheck />}
    </div>
  );
};

export default Layout;
