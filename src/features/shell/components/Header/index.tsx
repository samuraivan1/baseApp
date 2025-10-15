import React from 'react';
import ResponsiveAppBar from '../ResponsiveAppBar';
import './Header.scss';
import { useAuthStore } from '@/features/shell/state/authStore';

const Header: React.FC = () => {
  const authReady = useAuthStore((s) => s.authReady);
  const state = useAuthStore.getState() as { phase?: 'idle' | 'loading' | 'ready' | 'error'; authReady: boolean };
  const phase = state.phase ?? (authReady ? 'ready' : 'idle');
  return (
    // La etiqueta <header> tiene la clase 'header' que controla su tamaño
    <header className="header">
      {!authReady && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #999, #555)', animation: 'header-loading 1.2s infinite' }} />
      )}
      {import.meta.env.DEV && (
        <div style={{ position: 'absolute', top: 6, right: 12, fontSize: 11, color: '#444', opacity: 0.8 }}>
          Auth: {String(phase)}
        </div>
      )}
      {/* ResponsiveAppBar es ahora el hijo que se adapta al tamaño del padre */}
      <ResponsiveAppBar />
    </header>
  );
};

export default Header;
