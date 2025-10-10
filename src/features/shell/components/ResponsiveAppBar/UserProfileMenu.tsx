import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useProfileMenu } from './hooks/useProfileMenu';
import { useAuthStore } from '@/features/shell/state/authStore';
import { logout as apiLogout } from '@/shared/api/authService';
import { NavMenuItem } from '@/shared/types/ui';
import { toast } from 'react-toastify';
import { authMessages } from '@/constants/commonMessages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import iconMap from './iconMap';

// Type guards para evitar 'any' implícitos
function isDivider(item: NavMenuItem): boolean {
  return (item as any).kind === 'divider' || item.titulo === 'divider';
}
function hasChildren(
  item: NavMenuItem
): item is NavMenuItem & { items: NavMenuItem[] } {
  return Array.isArray((item as any).items) && (item as any).items.length > 0;
}
import './UserProfileMenu.scss';

// Iconos vienen de un mapa centralizado y se seleccionan por `iconKey`.

// --- Componente interno recursivo para los items del menú ---
const MenuItem: React.FC<{ item: NavMenuItem; onLogout: () => void }> = ({
  item,
  onLogout,
}) => {
  // Divider tipado o legado por titulo
  if (isDivider(item)) {
    return <li className="user-menu__divider" role="separator" />;
  }
  const sub = hasChildren(item);

  if (item.titulo === 'Cerrar Sesión') {
    return (
      <li className="user-menu__item">
        <button onClick={onLogout} className="user-menu__button">
          <FontAwesomeIcon
            icon={iconMap[item.iconKey ?? item.titulo]}
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
        {iconMap[item.iconKey ?? item.titulo] && (
          <FontAwesomeIcon
            icon={iconMap[item.iconKey ?? item.titulo]}
            className="user-menu__icon"
          />
        )}
        <span>{item.titulo}</span>
        {sub && (
          <FontAwesomeIcon
            icon={faChevronRight}
            className="user-menu__indicator"
          />
        )}
      </NavLink>
      {/* Si hay un submenú, se renderiza una nueva lista */}
      {sub && (
        <ul className="user-menu__submenu">
          {item.items?.map((subItem: NavMenuItem) => (
            <MenuItem key={subItem.idMenu} item={subItem} onLogout={onLogout} />
          ))}
        </ul>
      )}
    </li>
  );
};

// --- Componente principal ---
type UserProfileMenuProps = {
  items?: NavMenuItem[];
  user?: { full_name?: string | null; email?: string | null } | null;
  onLogout?: () => Promise<void> | void;
};

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  items,
  user: userProp,
  onLogout,
}) => {
  const { user: userStore, logout } = useAuthStore();
  const { profileMenuItems } = useProfileMenu();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
      return;
    }
    try {
      await apiLogout();
    } catch {}
    logout();
    toast.info(authMessages.logoutSuccess);
    navigate('/login');
  };

  return (
    <div className="user-menu">
      <div className="user-menu__header">
        <span className="user-menu__name">
          {(userProp ?? userStore)?.full_name}
        </span>
        <span className="user-menu__email">
          {(userProp ?? userStore)?.email}
        </span>
      </div>
      <hr className="user-menu__divider" />
      <ul className="user-menu__list">
        {(items ?? profileMenuItems).map((item) => (
          <MenuItem key={item.idMenu} item={item} onLogout={handleLogout} />
        ))}
      </ul>
    </div>
  );
};

export default UserProfileMenu;
