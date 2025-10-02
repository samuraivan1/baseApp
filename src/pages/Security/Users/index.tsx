import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import logger from '@/services/logger';
import { getUsers, deleteUser } from '@/features/security/api/userService';
import { getUserRoles } from '@/features/security/api/relationsService';
import UserForm from './UserForm';
import { usersMessages } from './Users.messages';
import './Users.scss';
import Button from '@/components/ui/Button';
import FormSection from '@/components/form/FormSection';
type UserView = {
  idUsuario: number;
  nombre: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  correoElectronico: string;
  nombreUsuario: string;
  status: 'activo' | 'inactivo';
  rolId?: number;
};
import type { User } from '@/types/security';

const UsuariosPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserView | null>(null);

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async (): Promise<UserView[]> => {
      const [users, userRoles] = await Promise.all([getUsers(), getUserRoles()]);
      const roleByUser = new Map(userRoles.map((ur) => [ur.user_id, ur.role_id]));
      return users.map((u: User) => ({
        idUsuario: u.user_id,
        nombre: u.first_name,
        apellidoPaterno: u.last_name_p,
        apellidoMaterno: u.last_name_m ?? undefined,
        correoElectronico: u.email,
        nombreUsuario: u.username,
        status: u.is_active === 1 ? 'activo' : 'inactivo',
        rolId: roleByUser.get(u.user_id) ?? undefined,
      }));
    },
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const delMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      toast.success(usersMessages.deleteSuccess);
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (err: unknown) => {
      const error =
        err instanceof Error ? err : new Error('Error eliminando usuario');
      logger.error(error, { context: 'deleteUsuario', original: err });
      toast.error(usersMessages.genericError);
    },
    onSettled: () => setDeletingId(null),
  });

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };
  const openEdit = (u: UserView) => {
    setEditing(u);
    setIsModalOpen(true);
  };

  return (
    <div className="segu-users">
      <FormSection title={usersMessages.title} useGrid={false}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <Button variant="primary" onClick={openCreate}>{usersMessages.createButton}</Button>
        </div>

      {isLoading ? (
        <p>{usersMessages.loading}</p>
      ) : (
        <div className="fs-table-container">
        <table className="segu-users__table" style={{ width: 'max-content' }}>
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
                  <Button variant="secondary" onClick={() => openEdit(u)}>
                    {usersMessages.edit}
                  </Button>
                  <Button
                    variant="danger"
                    isLoading={deletingId === u.idUsuario}
                    disabled={deletingId != null}
                    onClick={() => {
                      setDeletingId(u.idUsuario);
                      delMutation.mutate(u.idUsuario);
                    }}
                  >
                    {usersMessages.delete}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      </FormSection>
      {isModalOpen && (
        <div className="segu-users__modal">
          <div className="segu-users__modal-content">
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
