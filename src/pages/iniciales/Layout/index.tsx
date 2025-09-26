import React from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import Footer from '../Footer';
// ✅ Vuelve a usar el componente Header desacoplado
import Header from '../Header';
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
