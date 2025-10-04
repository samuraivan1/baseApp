import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavMenuItem } from '@/shared/types/ui';
import './CustomNavMenu.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faColumns,
  faTasks,
  faChartBar,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const iconMap: Record<string, unknown> = {
  Home: faHome,
  Kanban: faColumns,
  seguistración: faTasks,
  Dashboard: faChartBar,
};

// --- Interfaces ---
interface MenuItemProps {
  item: NavMenuItem;
  onItemClick?: (item: NavMenuItem) => void;
}
interface CustomNavMenuProps {
  items: NavMenuItem[];
  onItemClick?: (item: NavMenuItem) => void;
}

// --- Componente MenuItem (recursivo) ---
const MenuItem: React.FC<MenuItemProps> = ({ item, onItemClick }) => {
  const hasSubmenu = item.items && item.items.length > 0;

  if (item.kind === 'divider' || item.titulo === 'divider') {
    return <li className="nav-menu__divider" />;
  }

  const handleClick = (e: React.MouseEvent) => {
    // Si el item tiene submenú y no tiene link directo, prevenimos la navegación
    if (hasSubmenu && !item.ruta) {
      e.preventDefault();
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <li className="nav-menu__item">
      <NavLink
        to={item.ruta || '#'}
        className="nav-menu__link"
        onClick={handleClick}
      >
        {iconMap[item.iconKey ?? item.titulo] && (
          <FontAwesomeIcon
            icon={iconMap[item.iconKey ?? item.titulo]}
            className="nav-menu__icon"
          />
        )}
        <span className="nav-menu__title">{item.titulo}</span>
        {hasSubmenu && (
          <FontAwesomeIcon
            icon={faChevronRight}
            className="nav-menu__indicator"
          />
        )}
      </NavLink>
      {hasSubmenu && (
        <ul className="nav-menu__submenu">
          {item.items?.map((subItem) => (
            <MenuItem
              key={subItem.idMenu}
              item={subItem}
              onItemClick={onItemClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// --- Componente Principal ---
const CustomNavMenu: React.FC<CustomNavMenuProps> = ({
  items,
  onItemClick,
}) => {
  return (
    <ul className="nav-menu">
      {items.map((item) => (
        <MenuItem key={item.idMenu} item={item} onItemClick={onItemClick} />
      ))}
    </ul>
  );
};

export default CustomNavMenu;
