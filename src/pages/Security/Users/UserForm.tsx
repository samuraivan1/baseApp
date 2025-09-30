import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import logger from '@/services/logger';
import { createUser, updateUser } from '@/features/security/api/userService';
import { addUserRole, getUserRoles, removeUserRole } from '@/features/security/api/relationsService';
import { userSchema, UserFormValues } from './validationSchema';
import { userFormMessages } from './UserForm.messages';
import './UserForm.scss';
import Button from '@/components/ui/Button';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

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

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormValues>({
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
    mutationFn: async (payload: UserFormValues) => {
      const created = await createUser({
        username: String(payload.nombreUsuario || ''),
        email: String(payload.correoElectronico || ''),
        first_name: String(payload.nombre || ''),
        last_name_p: String(payload.apellidoPaterno || ''),
        last_name_m: payload.apellidoMaterno ?? null,
        initials: null,
        password_hash: undefined,
        is_active: payload.status ? payload.status === 'activo' : 1,
        mfa_enabled: 0,
      });
      if (payload.rolId != null) {
        try {
          await addUserRole(created.user_id, Number(payload.rolId));
        } catch {}
      }
      return created;
    },
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
    mutationFn: async ({ id, payload }: UpdateUsuarioVariables) => {
      const updated = await updateUser(id, {
        username: payload.nombreUsuario,
        email: payload.correoElectronico,
        first_name: payload.nombre,
        last_name_p: payload.apellidoPaterno,
        last_name_m: payload.apellidoMaterno ?? null,
        initials: null,
        password_hash: undefined,
        is_active: payload.status ? payload.status === 'activo' : undefined,
      });

      if (payload.rolId !== undefined) {
        const relations = await getUserRoles();
        const current = relations.find((ur) => ur.user_id === id);
        if (current && current.role_id !== Number(payload.rolId)) {
          await removeUserRole(current.id);
        }
        if (payload.rolId != null) {
          await addUserRole(id, Number(payload.rolId));
        }
      }
      return updated;
    },
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
      <LoadingOverlay
        open={isSubmitting || createMutation.isPending || updateMutation.isPending}
        message="Guardando usuario..."
      />
      <div className="user-form__group">
        <label>Nombre</label>
        <input {...register('nombre')} />
        {errors.nombre && <p className="error">{errors.nombre.message}</p>}
      </div>
      <div className="user-form__group">
        <label>Correo electrónico</label>
        <input {...register('correoElectronico')} />
        {errors.correoElectronico && <p className="error">{errors.correoElectronico.message}</p>}
      </div>
      <div className="user-form__group">
        <label>Nombre de usuario</label>
        <input {...register('nombreUsuario')} />
        {errors.nombreUsuario && <p className="error">{errors.nombreUsuario.message}</p>}
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
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
          isLoading={isSubmitting || createMutation.isPending || updateMutation.isPending}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
