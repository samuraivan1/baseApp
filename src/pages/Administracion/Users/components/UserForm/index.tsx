import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import logger from '@/services/logger';
import { createUser, updateUser } from '@/services/usersService';
import { userFormSchema, UserFormData } from './validationSchema';
import { userFormText } from './UserForm.messages';
import './UserForm.scss';

interface UserFormProps {
  initialData?: UserFormData;
  onSuccess: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData ?? {
      nombre: '',
      correo_electronico: '',
      rolId: '',
      estado: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        nombre: '',
        correo_electronico: '',
        rolId: '',
        estado: true,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (initialData && (initialData.id_usuario || (initialData as any).id)) {
        const id = (initialData as any).id_usuario ?? (initialData as any).id;
        await updateUser(id, data);
        toast.success(userFormText.updateSuccess);
      } else {
        await createUser(data);
        toast.success(userFormText.createSuccess);
      }
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error, { context: 'UserForm error' });
        toast.error(error.message || userFormText.genericError);
      } else {
        logger.error(new Error('Error desconocido en UserForm'), { originalError: error });
        toast.error(userFormText.genericError);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="user-form">
      <div className="user-form__group">
        <label className="user-form__label">{userFormText.name}</label>
        <input className="user-form__input" {...register('nombre')} />
        {errors.nombre && <p className="user-form__error">{errors.nombre.message}</p>}
      </div>

      <div className="user-form__group">
        <label className="user-form__label">{userFormText.email}</label>
        <input className="user-form__input" {...register('correo_electronico')} />
        {errors.correo_electronico && <p className="user-form__error">{errors.correo_electronico.message}</p>}
      </div>

      <div className="user-form__group">
        <label className="user-form__label">{userFormText.role}</label>
        <select className="user-form__select" {...register('rolId')}>
          <option value="">{userFormText.selectRole}</option>
          <option value="1">Super Administrador</option>
          <option value="2">Usuario Básico</option>
        </select>
        {errors.rolId && <p className="user-form__error">{errors.rolId.message}</p>}
      </div>

      <div className="user-form__group user-form__group--checkbox">
        <label className="user-form__checkbox">
          <input type="checkbox" {...register('estado')} />
          {userFormText.active}
        </label>
      </div>

      <div className="user-form__actions">
        <button type="submit" className="user-form__button user-form__button--primary" disabled={isSubmitting}>
          {isSubmitting ? userFormText.loadingButton : (initialData ? userFormText.updateButton : userFormText.createButton)}
        </button>
        <button type="button" className="user-form__button user-form__button--secondary" onClick={onCancel}>
          {userFormText.cancelButton}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
