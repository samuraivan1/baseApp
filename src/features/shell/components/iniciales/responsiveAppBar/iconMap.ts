import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import {
  faHome,
  faColumns,
  faTachometerAlt,
  faUser,
  faUsers,
  faListUl,
  faPlus,
  faBolt,
  faLayerGroup,
  faShieldAlt,
  faLink,
  faCogs,
  faBell,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

// Mapa de iconos centralizado por clave estable (iconKey)
export const iconMap: Record<string, IconDefinition> = {
  Home: faHome,
  Kanban: faColumns,
  Dashboard: faTachometerAlt,

  Perfil: faUser,
  Account: faCogs,
  Settings: faCogs,
  Bell: faBell,
  'Cerrar Sesión': faSignOutAlt,

  Users: faUsers,
  List: faListUl,
  Add: faPlus,
  Flash: faBolt,
  Advanced: faLayerGroup,
  Shield: faShieldAlt,
  Roles: faLayerGroup,
  Link: faLink,
};

export default iconMap;

