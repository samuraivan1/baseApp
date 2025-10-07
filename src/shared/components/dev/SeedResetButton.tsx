import React from 'react';
import { devMessages } from './SeedResetButton.messages';

const SeedResetButton: React.FC = () => {
  if (import.meta.env.MODE !== 'development') return null;
  const handleReset = () => {
    try {
      localStorage.removeItem('msw:db');
      // eslint-disable-next-line no-alert
      // Toast en vez de alert para UX consistente
      import('react-toastify').then(({ toast }) => toast.info('Snapshot de MSW eliminado. Recargando...'));
      location.reload();
    } catch {
      // noop
    }
  };
  const style: React.CSSProperties = {
    position: 'fixed',
    bottom: 12,
    right: 12,
    padding: '6px 10px',
    background: '#333',
    color: '#fff',
    borderRadius: 6,
    fontSize: 12,
    opacity: 0.6,
    cursor: 'pointer',
    zIndex: 9999,
  };
  return (
    <button type="button" style={style} onClick={handleReset} title={devMessages.resetSeedTitle}>
      Reset seed
    </button>
  );
};

export default SeedResetButton;
