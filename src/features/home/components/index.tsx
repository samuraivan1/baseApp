import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/shell/state/authStore';
import { silentRefresh } from '@/shared/auth/silentRefresh';
import { HOME_BACKGROUND_IMAGE } from '@/constants/uiConstants';
import { homeMessages } from './Home.messages';
import './Home.scss';
import Button from '@/shared/components/ui/Button';
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ensureSafeUrl } from '@/shared/security/url';
import { toast } from 'react-toastify';
import { useTheme } from '@/core';

const Home: React.FC = () => {
  const { user, authReady, isLoggedIn, logout } = useAuthStore((s) => ({ user: s.user, authReady: s.authReady, isLoggedIn: s.isLoggedIn, logout: s.logout }));
  const [showInspector, setShowInspector] = useState(false);
  const [didRecover, setDidRecover] = useState(false);

  // Recuperación post-login: si authReady está true pero no hay permisos aún, intenta refrescar una vez.
  useEffect(() => {
    if (import.meta.env.DEV && isLoggedIn && authReady && (!user || !user.permissions || user.permissions.length === 0) && !didRecover) {
      setDidRecover(true);
      silentRefresh().catch(() => void 0);
    }
  }, [isLoggedIn, authReady, user, didRecover]);
  const safeBg = useMemo(
    () =>
      ensureSafeUrl(HOME_BACKGROUND_IMAGE, {
        allowRelative: true,
        allowHttpSameOrigin: true,
      }),
    []
  );
  if (!authReady) {
    return (
      <div className="home-page" style={safeBg ? { backgroundImage: `url(${safeBg})` } : undefined}>
        <div className="home-overlay"></div>
        <div className="home-content">
          <h2>Cargando sesión…</h2>
          <p>Esperando autenticación y permisos.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="home-page"
      style={safeBg ? { backgroundImage: `url(${safeBg})` } : undefined}
    >
      <div className="home-overlay"></div>
      <div className="home-content">
        <h1>
          {homeMessages.welcome} {user?.first_name || homeMessages.defaultUser}
        </h1>
        <p>{homeMessages.tagline}</p>
        <Link to="/kanban" className="home-button">
          {homeMessages.button}
        </Link>

        {import.meta.env.DEV && (
          <div style={{ position: 'absolute', top: 16, right: 16 }}>
            <Button variant="secondary" onClick={() => setShowInspector((v) => !v)}>
              {showInspector ? 'Ocultar Inspector Dev' : 'Inspector Dev'}
            </Button>
          </div>
        )}

        {import.meta.env.DEV && showInspector && (
          <div style={{
            position: 'fixed', top: 72, right: 16, width: 360, maxWidth: '90vw',
            background: 'white', color: '#222', border: '1px solid #ddd', borderRadius: 8, padding: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 9999
          }}>
            <h4 style={{ marginTop: 0 }}>Inspector de Autenticación</h4>
            <div style={{ fontSize: 12, lineHeight: 1.6 }}>
              <div><strong>isLoggedIn:</strong> {String(isLoggedIn)}</div>
              <div><strong>authReady:</strong> {String(authReady)}</div>
              <div><strong>user_id:</strong> {user?.user_id ?? '—'}</div>
              <div><strong>username:</strong> {'username' in (user as object || {}) ? (user as { username?: string }).username ?? '—' : '—'}</div>
              <div><strong>full_name:</strong> {user?.full_name ?? '—'}</div>
              <div><strong>email:</strong> {user?.email ?? '—'}</div>
              <div><strong>roles (ids):</strong> {(user?.roles as Array<{ role_id: number }> | undefined)?.map(r => r.role_id).join(', ') ?? '—'}</div>
              <div><strong>permissions:</strong></div>
              <ul style={{ maxHeight: 160, overflow: 'auto', marginTop: 4 }}>
                {(user?.permissions ?? []).map((p, i) => (
                  <li key={i}><code>{p.permission_string}</code></li>
                ))}
              </ul>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button variant="primary" onClick={() => silentRefresh()}>Refrescar sesión</Button>
              <Button variant="danger" onClick={() => logout()}>Cerrar sesión</Button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Demo de Botones</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button variant="primary" icon={faPlus}>
              {homeMessages.btnPrimary}
            </Button>
            <Button variant="secondary">{homeMessages.btnSecondary}</Button>
            <Button variant="danger" icon={faTrash}>
              {homeMessages.btnDanger}
            </Button>
            <Button variant="outline">{homeMessages.btnOutline}</Button>
            <Button variant="ghost">{homeMessages.btnGhost}</Button>
            <Button variant="subtle">{homeMessages.btnSubtle}</Button>
            <Button variant="link" icon={faEdit}>
              {homeMessages.btnLink}
            </Button>
            <Button variant="link" tone="danger">
              {homeMessages.btnLinkDanger}
            </Button>
            <Button variant="primary" isLoading>
              {homeMessages.btnLoading}
            </Button>
          </div>
        </div>

        {/* Core Demo */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 12 }}>{homeMessages.coreDemoTitle}</h3>
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="primary"
              onClick={() => toast.success(homeMessages.notifySuccessMessage)}
            >
              {homeMessages.notifySuccess}
            </Button>
            <ThemedTokenPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

function ThemedTokenPreview() {
  const theme = useTheme();
  return (
    <span style={{ color: theme.primary }}>
      {homeMessages.themePrimaryLabel} <code>{String(theme.primary)}</code>
    </span>
  );
}
