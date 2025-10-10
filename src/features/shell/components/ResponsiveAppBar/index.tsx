import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/shell/state/authStore';
import CustomNavMenu from './CustomNavMenu';
import { images } from '@/assets/images';
import './ResponsiveAppBar.scss';
import { useMainMenu } from './hooks/useMainMenu';
import UserProfileMenu from './UserProfileMenu';
import { appBarMessages } from './ResponsiveAppBar.messages';
import { NavMenuItem } from '@/shared/types/ui';
import { useProfileMenu } from './hooks/useProfileMenu';

const ResponsiveAppBar: React.FC = () => {
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const { menuItems, isLoadingMenu } = useMainMenu();
  const { profileMenuItems, isLoadingProfile } = useProfileMenu();

  const dividerItem: NavMenuItem = { idMenu: 9999, titulo: 'divider' };
  const mobileMenuItems = [...menuItems, dividerItem, ...profileMenuItems];

  // ⬇️ NUEVO: ref para detectar clic fuera
  const userMenuWrapperRef = useRef<HTMLDivElement>(null);

  // ⬇️ NUEVO: listeners globales cuando el menú está abierto
  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const node = userMenuWrapperRef.current;
      if (node && !node.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isUserMenuOpen]);

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
          <img src={images.logoHeader} alt="Logo" />
        </Link>

        <nav className="app-bar__desktop-menu">
          <CustomNavMenu items={menuItems} />
        </nav>

        <div className="app-bar__right-section">
          {/* ⬇️ envuelve avatar + menú con el ref */}
          <div className="app-bar__user-profile" ref={userMenuWrapperRef}>
            <button
              className="app-bar__avatar"
              onClick={() => setUserMenuOpen(!isUserMenuOpen)}
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
            >
              {user?.initials || 'U'}
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
          <CustomNavMenu items={mobileMenuItems} />
        </nav>
      )}
    </div>
  );
};

export default ResponsiveAppBar;
