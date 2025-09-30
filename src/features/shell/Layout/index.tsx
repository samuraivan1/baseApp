import React from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import Footer from '@/features/shell/components/Footer';
import Header from '@/features/shell/components/Header';
import ErrorBoundary from '@/components/ErrorBoundary';
import './Layout.scss';

const Layout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const contentClassName = `layout__content ${isLoginPage ? 'layout__content--login' : ''}`;

  return (
    <div className="layout">
      {!isLoginPage && <Header />}
      <main className={contentClassName}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default Layout;
