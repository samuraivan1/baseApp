import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import logger from '@/services/logger';
import { getPermisos, deletePermiso } from '@/services/adminService';
import { permisosMessages } from './Permisos.messages';
import './Permisos.scss';


const PermisosPage: React.FC = () => {
  const queryClient = useQueryClient();
  //const { data: permisos, isLoading } = useQuery(['permisos'], getPermisos);

  const { data: permisos, isLoading } = useQuery({
    queryKey: ['permisos'],
    queryFn: getPermisos,
  });

  const delMutation = useMutation({
    mutationFn: (id: number) => deletePermiso(id),
    onSuccess: () => {
      toast.success(permisosMessages.deleteSuccess);
      queryClient.invalidateQueries({ queryKey: ['permisos'] });
    },
    onError: (err: any) => {
      logger.error(err);
      toast.error(permisosMessages.genericError);
    },
  });

  return (
    <div className="admin-permisos">
      <div className="admin-permisos__header">
        <h2>{permisosMessages.title}</h2>
      </div>
      {isLoading ? (
        <p>{permisosMessages.loading}</p>
      ) : (
        <table className="admin-permisos__table">
          <thead>
            <tr>
              <th>Clave</th>
              <th>Resource</th>
              <th>Action</th>
              <th>Scope</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {permisos?.map((p) => (
              <tr key={p.idPermiso}>
                <td>{p.permiso}</td>
                <td>{p.resource}</td>
                <td>{p.action}</td>
                <td>{p.scope}</td>
                <td>{p.descripcion}</td>
                <td>
                  <button
                    className="btn btn--danger"
                    onClick={() => delMutation.mutate(p.idPermiso)}
                  >
                    {permisosMessages.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PermisosPage;
