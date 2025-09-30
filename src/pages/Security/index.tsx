import React from 'react';
// ✅ 1. Asegúrate de importar Outlet y NavLink
import { Outlet, NavLink } from 'react-router-dom';
import { seguridadMessages } from './Security.messages';
import './Security.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserTag, faKey } from '@fortawesome/free-solid-svg-icons';

const SeguridadLayout: React.FC = () => {
  return (
    <div className="segu-layout">
      {/* BARRA LATERAL DE NAVEGACIÓN */}
      <nav className="segu-layout__sidebar">
        <h1 className="sidebar__title">{seguridadMessages.title}</h1>
        <NavLink
          to="/seguridad/usuarios"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          <FontAwesomeIcon icon={faUsers} className="sidebar__icon" />
          {seguridadMessages.usuarios}
        </NavLink>
        <NavLink
          to="/seguridad/roles"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          <FontAwesomeIcon icon={faUserTag} className="sidebar__icon" />
          {seguridadMessages.roles}
        </NavLink>
        <NavLink
          to="/seguridad/permisos"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          <FontAwesomeIcon icon={faKey} className="sidebar__icon" />
          {seguridadMessages.permisos}
        </NavLink>
      </nav>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="segu-layout__content">
        {/* ✅ 2. La clave: El Outlet le dice a React Router dónde renderizar las rutas hijas */}
        <Outlet />
      </main>
    </div>
  );
};

export default SeguridadLayout;
