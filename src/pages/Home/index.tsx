import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { HOME_BACKGROUND_IMAGE } from '@/constants/uiConstants';
import { homeMessages } from './Home.messages';
import './Home.scss';

const Home: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <div
      className="home-page"
      style={{ backgroundImage: `url(${HOME_BACKGROUND_IMAGE})` }}
    >
      <div className="home-overlay"></div>
      <div className="home-content">
        <h1>
          {homeMessages.welcome} {user?.nombreCompleto || homeMessages.defaultUser}
        </h1>
        <p>{homeMessages.tagline}</p>
        <Link to="/kanban" className="home-button">
          {homeMessages.button}
        </Link>
      </div>
    </div>
  );
};

export default Home;