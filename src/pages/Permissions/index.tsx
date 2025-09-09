import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import './Permissions.scss';
import '../admin.styles.scss';

const Permissions: React.FC = () => {
  const { permissions, isLoading, isError } = usePermissions();

  if (isLoading) {
    return <div className="admin-page"><h1>Cargando Permisos...</h1></div>;
  }

  if (isError) {
    return <div className="admin-page"><h1>Error al cargar los permisos.</h1></div>;
  }

  return (
    <div className="admin-page">
      <h1>Catálogo de Permisos del Sistema</h1>
      <p className="page-description">
        Esta es la lista de todas las acciones granulares disponibles en la aplicación. Los permisos se asignan a los roles para conceder autorizaciones.
      </p>
      <div className="permissions-catalog">
        <div className="permissions-catalog__header">
          <span>Permiso (Clave para el código)</span>
          <span>Descripción (Significado funcional)</span>
        </div>
        <div className="permissions-catalog__body">
          {permissions.map((permission) => (
            <div key={permission.idPermiso} className="permissions-catalog__row">
              <code className="permission-key">{permission.permiso}</code>
              <span>{permission.descripcion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Permissions;