// src/iniciales/responsiveAppBar/UserProfileMenu.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useProfileMenu } from './hooks/useProfileMenu';
import { useAuthStore } from '@/store/authStore';
import { NavMenuItem } from '@/types/ui';
import { toast } from 'react-toastify';
import { authMessages } from '@/constants/commonMessages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCog,
  faTachometerAlt,
  faSignOutAlt,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import './UserProfileMenu.scss';

// Mapa de iconos (sin cambios)
const iconMap: { [key: string]: any } = {
  Perfil: faUser,
  Account: faCog,
  Dashboard: faTachometerAlt,
  'Cerrar Sesión': faSignOutAlt,
};

// --- Componente interno recursivo para los items del menú ---
const MenuItem: React.FC<{ item: NavMenuItem; onLogout: () => void }> = ({
  item,
  onLogout,
}) => {
  const hasSubmenu = item.items && item.items.length > 0;

  if (item.titulo === 'Cerrar Sesión') {
    return (
      <li className="user-menu__item">
        <button onClick={onLogout} className="user-menu__button">
          <FontAwesomeIcon
            icon={iconMap[item.titulo]}
            className="user-menu__icon"
          />
          {item.titulo}
        </button>
      </li>
    );
  }

  return (
    <li className="user-menu__item">
      <NavLink to={item.ruta || '#'} className="user-menu__button">
        {iconMap[item.titulo] && (
          <FontAwesomeIcon
            icon={iconMap[item.titulo]}
            className="user-menu__icon"
          />
        )}
        <span>{item.titulo}</span>
        {hasSubmenu && (
          <FontAwesomeIcon
            icon={faChevronRight}
            className="user-menu__indicator"
          />
        )}
      </NavLink>
      {/* Si hay un submenú, se renderiza una nueva lista */}
      {hasSubmenu && (
        <ul className="user-menu__submenu">
          {item.items?.map((subItem) => (
            <MenuItem key={subItem.idMenu} item={subItem} onLogout={onLogout} />
          ))}
        </ul>
      )}
    </li>
  );
};

// --- Componente principal ---
const UserProfileMenu: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { profileMenuItems } = useProfileMenu();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info(authMessages.logoutSuccess);
    navigate('/login');
  };

  return (
    <div className="user-menu">
      <div className="user-menu__header">
        <span className="user-menu__name">{user?.nombreCompleto}</span>
        <span className="user-menu__email">{user?.email}</span>
      </div>
      <hr className="user-menu__divider" />
      <ul className="user-menu__list">
        {profileMenuItems.map((item) => (
          <MenuItem key={item.idMenu} item={item} onLogout={handleLogout} />
        ))}
      </ul>
    </div>
  );
};

export default UserProfileMenu;
