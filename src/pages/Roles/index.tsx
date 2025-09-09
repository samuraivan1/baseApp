import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema, RoleFormData } from './validationSchema';
import { rolesMessages } from './Roles.messages';
import { useRoles } from '@/hooks/useRoles';
import { RoleType } from '@/services/api.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import '../admin.styles.scss';

// ✅ Definimos los valores por defecto fuera del componente.
const defaultFormValues: RoleFormData = {
  nombre: '',
  descripcion: '',
  permisos: [],
};

const Roles: React.FC = () => {
  const { roles, isLoading: isLoadingRoles } = useRoles();
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    // ✅ LA CORRECCIÓN CLAVE: Establecemos valores por defecto explícitos.
    // Esto alinea los tipos de Zod y React Hook Form.
    defaultValues: defaultFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'permisos',
  });

  useEffect(() => {
    if (selectedRole) {
      // Al seleccionar un rol, reseteamos el formulario con sus valores.
      // Nos aseguramos que los valores coincidan con la estructura por defecto.
      reset({
        ...defaultFormValues,
        ...selectedRole,
      });
    } else {
      // Al crear un nuevo rol, reseteamos al estado inicial.
      reset(defaultFormValues);
    }
  }, [selectedRole, reset]);

  const onSubmit: SubmitHandler<RoleFormData> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const finalData = {
      ...data,
      descripcion: data.descripcion || '', // Aseguramos que descripción nunca sea undefined
      permisos: data.permisos || [], // Aseguramos que permisos nunca sea undefined
    };
    console.log('Datos del rol guardados:', {
      id: selectedRole?.id,
      ...finalData,
    });
    toast.success(`Rol "${finalData.nombre}" guardado con éxito.`);
  };

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
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={selectedRole?.id === role.id ? 'active' : ''}
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
            <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
              <h2>
                {selectedRole
                  ? `${rolesMessages.editTitle} ${selectedRole.nombre}`
                  : rolesMessages.formTitle}
              </h2>
              <div className="form-group">
                <label htmlFor="nombre">{rolesMessages.roleNameLabel}</label>
                <input id="nombre" type="text" {...register('nombre')} />
                {errors.nombre && (
                  <p className="error-message">{errors.nombre.message}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="descripcion">
                  {rolesMessages.descriptionLabel}
                </label>
                <textarea id="descripcion" {...register('descripcion')} />
              </div>
              <div className="form-group">
                <label>{rolesMessages.permissionsLabel}</label>
                <div className="permissions-table">
                  <div className="permissions-table__header">
                    <span>{rolesMessages.permissionAction}</span>
                    <span>{rolesMessages.permissionDescription}</span>
                    <span></span>
                  </div>
                  {fields.map((field, index) => (
                    <div key={field.id} className="permissions-table__row">
                      <input
                        placeholder="ej: read:users"
                        {...register(`permisos.${index}.accion`)}
                      />
                      <input
                        placeholder="ej: Ver lista de usuarios"
                        {...register(`permisos.${index}.descripcion`)}
                      />
                      <button type="button" onClick={() => remove(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-permission-button"
                    onClick={() => append({ accion: '', descripcion: '' })}
                  >
                    + Agregar Permiso
                  </button>
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
