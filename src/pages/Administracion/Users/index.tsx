import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import logger from '@/services/logger';
import { getUsuarios, deleteUsuario } from '@/services/adminService';
import UserForm from './UserForm';
import { usersMessages } from './Users.messages';
import './Users.scss';
import { Usuario } from '@/pages/Administracion/types';

const UsuariosPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: getUsuarios,
  });
  const delMutation = useMutation({
    mutationFn: (id: number) => deleteUsuario(id),
    onSuccess: () => {
      toast.success(usersMessages.deleteSuccess);
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (err: any) => {
      logger.error(err, { context: 'deleteUsuario' });
      toast.error(usersMessages.genericError);
    },
  });

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };
  const openEdit = (u: Usuario) => {
    setEditing(u);
    setIsModalOpen(true);
  };

  return (
    <div className="admin-users">
      <div className="admin-users__header">
        <h2>{usersMessages.title}</h2>
        <div>
          <button className="btn btn--primary" onClick={openCreate}>
            {usersMessages.createButton}
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>{usersMessages.loading}</p>
      ) : (
        <table className="admin-users__table">
          <thead>
            <tr>
              <th>{usersMessages.nombre}</th>
              <th>{usersMessages.email}</th>
              <th>{usersMessages.rol}</th>
              <th>{usersMessages.status}</th>
              <th>{usersMessages.actions}</th>
            </tr>
          </thead>
          <tbody>
            {usuarios?.map((u) => (
              <tr key={u.idUsuario}>
                <td>
                  {u.nombre} {u.apellidoPaterno}
                </td>
                <td>{u.correoElectronico}</td>
                <td>{u.rolId}</td>
                <td>{u.status}</td>
                <td>
                  <button className="btn" onClick={() => openEdit(u)}>
                    {usersMessages.edit}
                  </button>
                  <button
                    className="btn btn--danger"
                    onClick={() => delMutation.mutate(u.idUsuario)}
                  >
                    {usersMessages.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="admin-users__modal">
          <div className="admin-users__modal-content">
            <h3>
              {editing ? usersMessages.editUser : usersMessages.createUser}
            </h3>
            <UserForm
              initialData={editing || undefined}
              onCancel={() => setIsModalOpen(false)}
              onSuccess={() => {
                setIsModalOpen(false);
                queryClient.invalidateQueries({ queryKey: ['usuarios'] });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
