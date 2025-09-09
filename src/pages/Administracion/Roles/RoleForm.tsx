import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import logger from '@/services/logger';
import { createRol, updateRol } from '@/services/adminService';
import { roleSchema, RoleFormValues } from './validationSchema';
import './RoleForm.scss';

// ✅ 1. Definimos un tipo más completo para los datos iniciales, que incluye el ID.
//    RoleFormValues solo tiene los campos del formulario.
interface RolCompleto extends RoleFormValues {
  idRol: number;
}

// ✅ 2. Tipamos las variables que la mutación de actualización recibirá.
interface UpdateRolVariables {
  id: number;
  payload: RoleFormValues;
}

interface Props {
  initialData?: RolCompleto | null;
  onCancel: () => void;
  onSuccess?: () => void;
}

const RoleForm: React.FC<Props> = ({ initialData, onCancel, onSuccess }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    // Usamos los datos iniciales para establecer los valores por defecto del formulario.
    defaultValues: initialData ?? {
      nombre: '',
      descripcion: '',
      permisosIds: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const createMutation = useMutation({
    mutationFn: createRol,
    onSuccess: () => {
      toast.success('Rol creado');
      queryClient.invalidateQueries({ queryKey: ['roles'] }); // Invalidar para recargar la lista
      onSuccess?.();
    },
    onError: (err: Error) => {
      logger.error(err);
      toast.error('Error al crear el rol');
    },
  });

  // ✅ 4. Tipamos correctamente la mutación de actualización.
  //    Espera recibir `UpdateRolVariables` ({ id, payload }) cuando se llame a `mutate`.
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: UpdateRolVariables) => updateRol(id, payload),
    onSuccess: () => {
      toast.success('Rol actualizado');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      onSuccess?.();
    },
    onError: (err: Error) => {
      logger.error(err);
      toast.error('Error al actualizar el rol');
    },
  });
  const submit = (data: RoleFormValues) => {
    if (initialData?.idRol) {
      updateMutation.mutate({ id: initialData.idRol, payload: data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="role-form">
      <div className="role-form__group">
        <label>Nombre</label>
        <input {...register('nombre')} />
        {errors.nombre && <p className="error">{errors.nombre.message}</p>}
      </div>
      <div className="role-form__group">
        <label>Descripción</label>
        <textarea {...register('descripcion')} />
      </div>
      <div className="role-form__group">
        <label>Permisos (ids, separados por coma)</label>
        <input {...register('permisosIds')} placeholder="1,2,3" />
        {errors.permisosIds && <p className="error">"Error 123654654564654"</p>}
      </div>
      <div className="role-form__actions">
        <button
          className="btn btn--primary"
          type="submit"
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

export default RoleForm;
