import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import logger from '@/services/logger';
import { createUsuario, updateUsuario } from '@/services/adminService';
import { userSchema, UserFormValues } from './validationSchema';
import { userFormMessages } from './UserForm.messages';
import './UserForm.scss';

interface UsuarioCompleto extends UserFormValues {
  idUsuario: number;
}

interface UpdateUsuarioVariables {
  id: number;
  payload: UserFormValues;
}

interface Props {
  initialData?: UsuarioCompleto | null;
  onSuccess?: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<Props> = ({ initialData, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData ?? {
      nombre: '',
      correoElectronico: '',
      nombreUsuario: '',
      rolId: undefined,
      status: 'activo',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const createMutation = useMutation({
    mutationFn: createUsuario,
    onSuccess: () => {
      toast.success(userFormMessages.createSuccess);
      onSuccess?.();
    },
    onError: (err: Error) => {
      logger.error(err, { context: 'createUsuario' });
      toast.error(userFormMessages.genericError);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: UpdateUsuarioVariables) =>
      updateUsuario(id, payload),
    onSuccess: () => {
      toast.success(userFormMessages.updateSuccess);
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      onSuccess?.();
    },
    onError: (err: Error) => {
      logger.error(err, { context: 'updateUsuario' });
      toast.error(userFormMessages.genericError);
    },
  });

  const submit = (data: UserFormValues) => {
    if (initialData?.idUsuario) {
      updateMutation.mutate({ id: initialData.idUsuario, payload: data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit(submit)}>
      <div className="user-form__group">
        <label>Nombre</label>
        <input {...register('nombre')} />
        {errors.nombre && <p className="error">{errors.nombre.message}</p>}
      </div>

      <div className="user-form__group">
        <label>Correo electrónico</label>
        <input {...register('correoElectronico')} />
        {errors.correoElectronico && (
          <p className="error">{errors.correoElectronico.message}</p>
        )}
      </div>

      <div className="user-form__group">
        <label>Nombre de usuario</label>
        <input {...register('nombreUsuario')} />
        {errors.nombreUsuario && (
          <p className="error">{errors.nombreUsuario.message}</p>
        )}
      </div>

      <div className="user-form__group">
        <label>Rol (id)</label>
        <input type="number" {...register('rolId', { valueAsNumber: true })} />
        {errors.rolId && <p className="error">{errors.rolId.message}</p>}
      </div>

      <div className="user-form__group">
        <label>Estatus</label>
        <select {...register('status')}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className="user-form__actions">
        <button
          type="submit"
          className="btn btn--primary"
          disabled={
            isSubmitting || createMutation.isPending || updateMutation.isPending
          }
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default UserForm;
