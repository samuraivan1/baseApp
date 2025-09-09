import React from 'react';
import { useRoles, usePermissions } from '@/hooks/useRoles';
import './Roles.scss';
import messages from './Roles.messages';

const RolesPage: React.FC = () => {
  const { data: roles, isLoading } = useRoles();
  const { data: permisos } = usePermissions();

  return (
    <div className="roles-page">
      <h1>Roles</h1>
      {isLoading ? <p>Cargando...</p> : (
        <div>
          <ul>
            {roles?.map((r) => (
              <li key={r.id}>
                <strong>{r.nombre}</strong> - {r.descripcion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RolesPage;
