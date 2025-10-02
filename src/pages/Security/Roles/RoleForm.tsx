import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/common/PageHeader';
import { CreateRoleDTO } from '@/types/security';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import './Roles.scss';

type RoleFormValues = {
  name: string;
  description?: string | null;
};

interface RoleFormProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<RoleFormValues>;
  onSubmit: (values: CreateRoleDTO) => void;
}

export default function RoleForm({
  open,
  onClose,
  initialValues,
  onSubmit,
}: RoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    defaultValues: {
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
    },
  });

  // Cerrar con tecla Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="orangealex-form">
        <PageHeader
          title={initialValues ? 'Editar Rol' : 'Nuevo Rol'}
          icon={faUserShield}
          titleSize="1.2rem"
        />

        {/* Contenido */}
        <form onSubmit={handleSubmit(onSubmit)} className="orangealex-form__body">
          <div className="orangealex-form__grid">
            <div className="form-field">
              <label className="form-label">Nombre del Rol</label>
              <input
                {...register('name', {
                  required: 'El nombre es obligatorio',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                  maxLength: { value: 100, message: 'Máximo 100 caracteres' },
                })}
                className="form-input"
              />
              {errors.name && (
                <span className="error">{errors.name.message}</span>
              )}
            </div>

            <div className="form-field form-field--full">
              <label className="form-label">Descripción</label>
              <textarea
                {...register('description', {
                  maxLength: { value: 255, message: 'Máximo 255 caracteres' },
                })}
                className="form-textarea"
              />
              {errors.description && (
                <span className="error">{errors.description.message}</span>
              )}
            </div>
          </div>

          {/* Botonera */}
          <div className="orangealex-form__footer">
            <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-orangealex" isLoading={isSubmitting}>
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
