import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Role } from '@/services/security.types';
import './Roles.scss';

interface RoleFormProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<Role>;
  onSubmit: (values: Role) => void;
}

export default function RoleForm({
  open,
  onClose,
  initialValues,
  onSubmit,
}: RoleFormProps) {
  const { register, handleSubmit } = useForm<Role>({
    defaultValues: initialValues,
  });

  return (
    <Modal open={open} onClose={onClose}>
      <div className="orangealex-form">
        {/* Encabezado */}
        <div className="orangealex-form__header">
          <span className="orangealex-form__icon">🟧</span>
          <h2 className="orangealex-form__title">
            {initialValues ? 'Editar Rol' : 'Nuevo Rol'}
          </h2>
        </div>

        {/* Contenido */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="orangealex-form__body"
        >
          <div className="orangealex-form__grid">
            <div className="form-field">
              <label className="form-label">Nombre del Rol</label>
              <input
                {...register('name', { required: true })}
                className="form-input"
              />
            </div>

            <div className="form-field form-field--full">
              <label className="form-label">Descripción</label>
              <textarea
                {...register('description')}
                className="form-textarea"
              />
            </div>
          </div>

          {/* Botonera */}
          <div className="orangealex-form__footer">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-orangealex">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
