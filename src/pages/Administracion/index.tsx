import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { adminMessages } from './Admin.messages';
import './Admin.scss';

const AdminLayout: React.FC = () => {
  return (
    <div className="admin">
      <header className="admin__header">
        <h1 className="admin__title">{adminMessages.title}</h1>
        <nav className="admin__nav">
          <Link to="/administracion/usuarios">{adminMessages.usuarios}</Link>
          <Link to="/administracion/roles">{adminMessages.roles}</Link>
          <Link to="/administracion/permisos">{adminMessages.permisos}</Link>
        </nav>
      </header>
      <main className="admin__content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
