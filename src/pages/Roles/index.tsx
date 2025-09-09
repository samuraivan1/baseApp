import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema, RoleFormData } from './validationSchema';
import { rolesMessages } from './Roles.messages';
import { useRoles } from '@/hooks/useRoles';
import { usePermissions } from '@/hooks/usePermissions';
import { RolType } from '@/services/api.types';
import { toast } from 'react-toastify';
import '../admin.styles.scss';
import './Roles.scss';

// ✅ 1. Definimos los valores por defecto explícitos para el formulario.
const defaultFormValues: RoleFormData = {
  nombre: '',
  descripcion: '',
  permisosIds: [],
};

const Roles: React.FC = () => {
  const { roles, isLoading: isLoadingRoles } = useRoles();
  const { permissions, isLoading: isLoadingPermissions } = usePermissions();
  const [selectedRole, setSelectedRole] = useState<RolType | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    // ✅ 2. Asignamos los valores por defecto. Esto resuelve el error del resolver.
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (selectedRole) {
      reset({
        ...defaultFormValues,
        ...selectedRole,
      });
    } else {
      reset(defaultFormValues);
    }
  }, [selectedRole, reset]);

  // ✅ 3. Usamos la función de envío anónima para máxima compatibilidad de tipos.
  return (
    <div className="admin-page">
      <h1>{rolesMessages.pageTitle}</h1>
      <div className="admin-container">
        <div className="list-panel">
          <button
            onClick={() => setSelectedRole(null)}
            className="new-item-button"
          >
            + Crear Nuevo Rol
          </button>
          {isLoadingRoles ? (
            <p>{rolesMessages.loading}</p>
          ) : (
            <ul className="items-list">
              {roles.map((role) => (
                <li
                  key={role.idRol}
                  onClick={() => setSelectedRole(role)}
                  className={selectedRole?.idRol === role.idRol ? 'active' : ''}
                >
                  {role.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-panel">
          {selectedRole === null && !isDirty ? (
            <div className="placeholder-panel">
              <p>{rolesMessages.noRoleSelected}</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(async (data) => {
                const finalData = {
                  ...data,
                  descripcion: data.descripcion || '',
                  permisosIds: data.permisosIds || [],
                };
                await new Promise((resolve) => setTimeout(resolve, 1500));
                console.log('Datos del rol guardados:', {
                  id: selectedRole?.idRol,
                  ...finalData,
                });
                toast.success(`Rol "${finalData.nombre}" guardado con éxito.`);
              })}
              className="admin-form"
            >
              <h2>
                {selectedRole
                  ? `${rolesMessages.editTitle} ${selectedRole.nombre}`
                  : rolesMessages.formTitle}
              </h2>

              <div className="form-group">
                <label htmlFor="nombre">{rolesMessages.roleNameLabel}</label>
                <input id="nombre" type="text" {...register('nombre')} />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">
                  {rolesMessages.descriptionLabel}
                </label>
                <textarea id="descripcion" {...register('descripcion')} />
              </div>

              <div className="form-group">
                <label>{rolesMessages.permissionsLabel}</label>
                <div className="permissions-grid">
                  {isLoadingPermissions ? (
                    <p>Cargando permisos...</p>
                  ) : (
                    permissions.map((permission) => (
                      <div
                        key={permission.idPermiso}
                        className="permission-item"
                      >
                        <input
                          type="checkbox"
                          id={`perm-${permission.idPermiso}`}
                          value={permission.idPermiso}
                          {...register('permisosIds', { valueAsNumber: true })}
                        />
                        <label htmlFor={`perm-${permission.idPermiso}`}>
                          <strong>{permission.permiso}</strong>
                          <small>{permission.descripcion}</small>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? rolesMessages.savingButton
                  : rolesMessages.saveButton}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roles;
