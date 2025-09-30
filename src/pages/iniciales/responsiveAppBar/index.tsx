import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import CustomNavMenu from './CustomNavMenu';
import { images } from '@/assets/images';
import './ResponsiveAppBar.scss';
import { useMainMenu } from './hooks/useMainMenu';
import UserProfileMenu from './UserProfileMenu';
import { appBarMessages } from './ResponsiveAppBar.messages';
import { NavMenuItem } from '@/types/ui';
import { useProfileMenu } from './hooks/useProfileMenu';

const ResponsiveAppBar: React.FC = () => {
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const { menuItems, isLoadingMenu } = useMainMenu();
  // ✅ Obtenemos también los items del menú de perfil
  const { profileMenuItems, isLoadingProfile } = useProfileMenu();

  // ✅ Creamos un item especial que usaremos como divisor visual
  const dividerItem: NavMenuItem = { idMenu: 9999, titulo: 'divider' };

  // ✅ Combinamos todos los items en un solo array para el menú móvil
  const mobileMenuItems = [...menuItems, dividerItem, ...profileMenuItems];

  if (isLoadingMenu || isLoadingProfile) {
    return (
      <div className="app-bar">
        <div className="app-bar__toolbar">{appBarMessages.loading}</div>
      </div>
    );
  }

  return (
    <div className="app-bar">
      <div className="app-bar__toolbar">
        <Link to="/home" className="app-bar__logo">
          <img src={images.sarttHeader} alt="SART Logo" />
        </Link>
        <nav className="app-bar__desktop-menu">
          <CustomNavMenu items={menuItems} />
        </nav>
        <div className="app-bar__right-section">
          <div className="app-bar__user-profile">
            <button
              className="app-bar__avatar"
              onClick={() => setUserMenuOpen(!isUserMenuOpen)}
            >
              {user?.iniciales || 'U'}
            </button>
            {isUserMenuOpen && <UserProfileMenu />}
          </div>
          <button
            className="app-bar__hamburger"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span /> <span /> <span />
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <nav className="app-bar__mobile-menu">
          {/* ✅ Pasamos el array combinado al menú móvil */}
          <CustomNavMenu items={mobileMenuItems} />
        </nav>
      )}
    </div>
  );
};

export default ResponsiveAppBar;
