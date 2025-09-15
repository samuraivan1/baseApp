import React, { useState, useMemo } from 'react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Rol | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const deleteMutation = useMutation({
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

  const handleOpenCreate = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (role: Rol) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const filteredRoles = useMemo(() => {
    if (!roles) return [];
    return roles.filter((role) =>
      role.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roles, searchTerm]);

  return (
    <div className="admin-page-container">
      {/* ✅ 1. Estructura del encabezado mejorada */}
      <div className="page-header">
        <h2 className="page-header__title">{rolesMessages.title}</h2>
        <hr className="page-header__divider" />
        <div className="page-header__toolbar">
          <input
            type="text"
            placeholder="Buscar por rol..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn--primary" onClick={handleOpenCreate}>
            + Añadir Rol
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>{rolesMessages.loading}</p>
      ) : (
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Nombre del Rol</th>
                <th>Descripción</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((r) => (
                <tr key={r.idRol}>
                  <td className="role-name-cell">{r.nombre}</td>
                  <td>{r.descripcion}</td>
                  <td>
                    <div className="action-links">
                      <button
                        className="action-link"
                        onClick={() => handleOpenEdit(r)}
                      >
                        Actualizar
                      </button>
                      <span className="action-divider">|</span>
                      <button
                        className="action-link action-link--danger"
                        onClick={() => deleteMutation.mutate(r.idRol)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="admin-roles__modal">
          <div className="admin-roles__modal-content">
            <h3>
              {editingRole ? rolesMessages.editRole : rolesMessages.createRole}
            </h3>
            <RoleForm
              initialData={editingRole || undefined}
              onCancel={() => setIsModalOpen(false)}
              onSuccess={() => {
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;
