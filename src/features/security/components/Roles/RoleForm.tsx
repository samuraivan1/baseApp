import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
// import Button from '@/shared/components/ui/Button';
import FormActions from '@/shared/components/common/FormActions';
import SectionHeader from '@/shared/components/common/SectionHeader';
import Button from '@/shared/components/ui/Button';
import { roleFormMessages as m } from './RoleForm.messages';
import { CreateRoleDTO } from '@/shared/types/security';
import { toast } from 'react-toastify';
import { mapAppErrorMessage } from '@/shared/utils/errorI18n';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
// estilos de página centralizados en features/security/styles/index.scss
import FormInput from '@/shared/components/common/forms/inputs/FormInput';
import FormTextarea from '@/shared/components/common/forms/inputs/FormTextarea';
import '@/shared/components/common/forms/orangealex-form.scss';
import LoadingOverlay from '@/shared/components/ui/LoadingOverlay';
import { commonDefaultMessages } from '@/i18n/commonMessages';

type RoleFormValues = {
  name: string;
  description?: string | null;
};

interface RoleFormProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<RoleFormValues>;
  onSubmit: (values: CreateRoleDTO) => void;
  readOnly?: boolean;
  hasEditPermission?: boolean;
}

export default function RoleForm({
  open,
  onClose,
  initialValues,
  onSubmit,
  readOnly = false,
  hasEditPermission = true,
}: RoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RoleFormValues>({
    defaultValues: {
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
    },
  });

  useEffect(() => {
    reset({
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
    });
  }, [initialValues, reset]);

  // Cerrar con Escape cuando está abierto
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className="orangealex-form oa-form--md oa-form--left">
      <SectionHeader
        title={initialValues ? (readOnly ? (m.viewTitle ?? m.editTitle) : m.editTitle) : m.newTitle}
        icon={faUserShield}
        onBack={onClose}
        right={readOnly && hasEditPermission ? (
          <Button type="button" onClick={(e) => { e.preventDefault(); try { document.dispatchEvent(new CustomEvent('roleform:request-edit')); } catch {} }}>
            {m.editTitleBtn ?? 'Editar'}
          </Button>
        ) : undefined}
      />

      {/* Contenido */}
      <form
        onSubmit={handleSubmit(async (v) => {
          if (readOnly || !hasEditPermission) return;
          try { await onSubmit(v as CreateRoleDTO); }
          catch (err) { toast.error(mapAppErrorMessage(err)); }
        })}
        className="orangealex-form__body"
      >
        <LoadingOverlay open={isSubmitting} message={commonDefaultMessages.saving} />
        <div className="orangealex-form__grid">
          <FormInput
            label={m.fields.name}
            {...register('name', {
              required: m.errors.nameRequired,
              minLength: { value: 3, message: m.errors.nameMin },
              maxLength: { value: 100, message: m.errors.nameMax },
            })}
            disabled={readOnly}
            error={errors.name?.message}
          />
          <FormTextarea
            label={m.fields.description}
            {...register('description', {
              maxLength: { value: 255, message: m.errors.descMax },
            })}
            wrapperClassName="form-field--full"
            disabled={readOnly}
            error={errors.description?.message}
          />
        </div>

        {/* Botonera común */}
        <div className="orangealex-form__footer">
          <FormActions
            onCancel={onClose}
            onAccept={() => {}}
            isAccepting={isSubmitting}
            hideAccept={readOnly || !hasEditPermission}
          />
        </div>
      </form>
    </div>
  );
}
