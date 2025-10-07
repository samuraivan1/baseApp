import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/shell/state/authStore';
import { HOME_BACKGROUND_IMAGE } from '@/constants/uiConstants';
import { homeMessages } from './Home.messages';
import './Home.scss';
import Button from '@/shared/components/ui/Button';
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ensureSafeUrl } from '@/shared/security/url';

const Home: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const safeBg = useMemo(
    () =>
      ensureSafeUrl(HOME_BACKGROUND_IMAGE, {
        allowRelative: true,
        allowHttpSameOrigin: true,
      }),
    []
  );
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

        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Demo de Botones</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button variant="primary" icon={faPlus}>{homeMessages.btnPrimary}</Button>
            <Button variant="secondary">{homeMessages.btnSecondary}</Button>
            <Button variant="danger" icon={faTrash}>{homeMessages.btnDanger}</Button>
            <Button variant="outline">{homeMessages.btnOutline}</Button>
            <Button variant="ghost">{homeMessages.btnGhost}</Button>
            <Button variant="subtle">{homeMessages.btnSubtle}</Button>
            <Button variant="link" icon={faEdit}>{homeMessages.btnLink}</Button>
            <Button variant="link" tone="danger">{homeMessages.btnLinkDanger}</Button>
            <Button variant="primary" isLoading>{homeMessages.btnLoading}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
