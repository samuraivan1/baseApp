import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserFormData } from './validationSchema';
import { usersMessages } from './Users.messages';
import { useUsers } from '@/hooks/useUsers';
import { useRoles } from '@/hooks/useRoles';
import { UsuarioType } from '@/services/api.types';
import { toast } from 'react-toastify';
import '../admin.styles.scss';

const defaultFormValues: Omit<UserFormData, 'rolId'> & { rolId: number | '' } =
  {
    nombre_usuario: '',
    nombre: '',
    apellido_paterno: '',
    correo_electronico: '',
    iniciales: '',
    rolId: '',
  };

const Users: React.FC = () => {
  const { users, isLoading: isLoadingUsers } = useUsers();
  const { roles, isLoading: isLoadingRoles } = useRoles();
  const [selectedUser, setSelectedUser] = useState<UsuarioType | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultFormValues as UserFormData,
  });

  useEffect(() => {
    if (selectedUser) {
      const { idUsuario, hashContrasena, ...formData } = selectedUser;
      reset(formData);
    } else {
      reset(defaultFormValues as UserFormData);
    }
  }, [selectedUser, reset]);

  return (
    <div className="admin-page">
      <h1>{usersMessages.pageTitle}</h1>

      <div className="admin-container">
        <div className="list-panel">
          <button
            onClick={() => setSelectedUser(null)}
            className="new-item-button"
          >
            + Crear Nuevo Usuario
          </button>
          {isLoadingUsers ? (
            <p>{usersMessages.loadingUsers}</p>
          ) : (
            <ul className="items-list">
              {users.map((user) => (
                <li
                  key={user.idUsuario}
                  onClick={() => setSelectedUser(user)}
                  className={
                    selectedUser?.idUsuario === user.idUsuario ? 'active' : ''
                  }
                >
                  {user.nombre} {user.apellidoPaterno}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-panel">
          {selectedUser === null && !isDirty ? (
            <div className="placeholder-panel">
              <p>{usersMessages.noUserSelected}</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(async (data) => {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                console.log('Datos del usuario guardados:', {
                  id: selectedUser?.idUsuario,
                  ...data,
                });
                toast.success(`Usuario "${data.nombre}" guardado con éxito.`);
              })}
              className="admin-form"
            >
              <h2>
                {selectedUser
                  ? `${usersMessages.editTitle} ${selectedUser.nombre}`
                  : usersMessages.formTitle}
              </h2>

              <div className="form-grid">
                {/* ... otros campos del formulario sin cambios ... */}
                <div className="form-group">
                  <label htmlFor="nombre_usuario">
                    {usersMessages.usernameLabel}
                  </label>
                  <input
                    id="nombre_usuario"
                    type="text"
                    {...register('nombre_usuario')}
                  />
                  {errors.nombre_usuario && (
                    <p className="error-message">
                      {errors.nombre_usuario.message}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="iniciales">
                    {usersMessages.initialsLabel}
                  </label>
                  <input
                    id="iniciales"
                    type="text"
                    {...register('iniciales')}
                  />
                  {errors.iniciales && (
                    <p className="error-message">{errors.iniciales.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="nombre">{usersMessages.firstNameLabel}</label>
                  <input id="nombre" type="text" {...register('nombre')} />
                  {errors.nombre && (
                    <p className="error-message">{errors.nombre.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="apellido_paterno">
                    {usersMessages.lastNameLabel}
                  </label>
                  <input
                    id="apellido_paterno"
                    type="text"
                    {...register('apellido_paterno')}
                  />
                  {errors.apellido_paterno && (
                    <p className="error-message">
                      {errors.apellido_paterno.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="correo_electronico">
                  {usersMessages.emailLabel}
                </label>
                <input
                  id="correo_electronico"
                  type="email"
                  {...register('correo_electronico')}
                />
                {errors.correo_electronico && (
                  <p className="error-message">
                    {errors.correo_electronico.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="rolId">{usersMessages.roleLabel}</label>
                <select
                  id="rolId"
                  // ✅ --- CAMBIO CLAVE 2 --- ✅
                  // Le decimos a React Hook Form que convierta el valor a número.
                  {...register('rolId', { valueAsNumber: true })}
                  disabled={isLoadingRoles}
                >
                  <option value="">{usersMessages.selectRoleOption}</option>
                  {roles.map((role) => (
                    <option key={role.idRol} value={role.idRol}>
                      {role.nombre}
                    </option>
                  ))}
                </select>
                {errors.rolId && (
                  <p className="error-message">{errors.rolId.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? usersMessages.savingButton
                  : usersMessages.saveButton}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
