import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import logger from '@/services/logger';
import { getUsers, deleteUser } from '@/services/usersService';
import UserForm from './components/UserForm';
import { usersPageText } from './Users.messages';
import './Users.scss';

const UsersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar usuario?')) return;
    try {
      await deleteUser(id);
      toast.success(usersPageText.deleteSuccess);
      refetch();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, { context: 'Delete User' });
        toast.error(error.message || usersPageText.genericError);
      } else {
        logger.error(new Error('Error desconocido en deleteUser'), { originalError: error });
        toast.error(usersPageText.genericError);
      }
    }
  };

  return (
    <div className="users">
      <div className="users__header">
        <h1>{usersPageText.title}</h1>
        <button className="users__button users__button--primary" onClick={handleCreate}>
          {usersPageText.createButton}
        </button>
      </div>

      {isLoading ? (
        <p>{usersPageText.loading}</p>
      ) : (
        <table className="users__table">
          <thead>
            <tr>
              <th>{usersPageText.name}</th>
              <th>{usersPageText.email}</th>
              <th>{usersPageText.role}</th>
              <th>{usersPageText.active}</th>
              <th>{usersPageText.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any) => (
              <tr key={user.id_usuario ?? user.id}>
                <td>{user.nombre ?? user.username}</td>
                <td>{user.correo_electronico ?? user.email}</td>
                <td>{user.rolId ?? user.role}</td>
                <td>{(user.estado ?? user.active) ? usersPageText.activeYes : usersPageText.activeNo}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>{usersPageText.edit}</button>
                  <button onClick={() => handleDelete(user.id_usuario ?? user.id)} className="danger">{usersPageText.delete}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="users__modal">
          <div className="users__modal-content">
            <h2>{editingUser ? usersPageText.editUser : usersPageText.createUser}</h2>
            <UserForm
              initialData={editingUser || undefined}
              onSuccess={() => { setIsModalOpen(false); refetch(); }}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
