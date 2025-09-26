import React from 'react';
// ✅ 1. Asegúrate de importar Outlet y NavLink
import { Outlet, NavLink } from 'react-router-dom';
import { adminMessages } from './Admin.messages';
import './Admin.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserTag, faKey } from '@fortawesome/free-solid-svg-icons';

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      {/* BARRA LATERAL DE NAVEGACIÓN */}
      <nav className="admin-layout__sidebar">
        <h1 className="sidebar__title">{adminMessages.title}</h1>
        <NavLink
          to="/administracion/usuarios"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          <FontAwesomeIcon icon={faUsers} className="sidebar__icon" />
          {adminMessages.usuarios}
        </NavLink>
        <NavLink
          to="/administracion/roles"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          <FontAwesomeIcon icon={faUserTag} className="sidebar__icon" />
          {adminMessages.roles}
        </NavLink>
        <NavLink
          to="/administracion/permisos"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
        >
          <FontAwesomeIcon icon={faKey} className="sidebar__icon" />
          {adminMessages.permisos}
        </NavLink>
      </nav>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="admin-layout__content">
        {/* ✅ 2. La clave: El Outlet le dice a React Router dónde renderizar las rutas hijas */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;