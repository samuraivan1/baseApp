import React from 'react';
import { usePermissions } from '@/hooks/useRoles';
import './Permissions.scss';

const PermissionsPage: React.FC = () => {
  const { data: permisos, isLoading } = usePermissions();

  return (
    <div className='permissions-page'>
      <h1>Permisos</h1>
      {isLoading ? <p>Cargando...</p> : (
        <ul>
          {permisos?.map((p) => (
            <li key={p.id}><strong>{p.id}</strong> - {p.description}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PermissionsPage;
