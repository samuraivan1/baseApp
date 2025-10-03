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
            <Button variant="primary" icon={faPlus}>
              Primary
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger" icon={faTrash}>
              Danger
            </Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="link" icon={faEdit}>
              Link
            </Button>
            <Button variant="link" tone="danger">
              Link Danger
            </Button>
            <Button variant="primary" isLoading>
              Loading
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
