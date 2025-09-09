import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import logger from '@/services/logger';
import { getRoles, deleteRol } from '@/services/adminService';
import RoleForm from './RoleForm';
import { rolesMessages } from './Roles.messages';
import './Roles.scss';
import { Rol } from '@/pages/Administracion/types';

const RolesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Rol | null>(null);
  //const { data: roles, isLoading } = useQuery(['roles'], getRoles);
  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const delMutation = useMutation({
    mutationFn: (id: number) => deleteRol(id),
    onSuccess: () => {
      toast.success(rolesMessages.deleteSuccess);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (err: any) => {
      logger.error(err);
      toast.error(rolesMessages.genericError);
    },
  });

  return (
    <div className="admin-roles">
      <div className="admin-roles__header">
        <h2>{rolesMessages.title}</h2>
        <div>
          <button
            className="btn btn--primary"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            {rolesMessages.createButton}
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>{rolesMessages.loading}</p>
      ) : (
        <table className="admin-roles__table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Permisos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles?.map((r) => (
              <tr key={r.idRol}>
                <td>{r.nombre}</td>
                <td>{r.descripcion}</td>
                <td>{(r.permisosIds || []).join(', ')}</td>
                <td>
                  <button
                    className="btn"
                    onClick={() => {
                      setEditing(r);
                      setOpen(true);
                    }}
                  >
                    {rolesMessages.edit}
                  </button>
                  <button
                    className="btn btn--danger"
                    onClick={() => delMutation.mutate(r.idRol)}
                  >
                    {rolesMessages.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {open && (
        <div className="admin-roles__modal">
          <div className="admin-roles__modal-content">
            <h3>
              {editing ? rolesMessages.editRole : rolesMessages.createRole}
            </h3>
            <RoleForm
              initialData={editing || undefined}
              onCancel={() => setOpen(false)}
              onSuccess={() => {
                setOpen(false);
                queryClient.invalidateQueries({ queryKey: ['roles'] });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;
