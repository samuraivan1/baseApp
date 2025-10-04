import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import SectionHeader from '@/shared/components/common/SectionHeader';
import FormActions from '@/shared/components/common/FormActions';
import { permissionFormMessages as m } from './PermissionForm.messages';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import '@/shared/components/common/forms/orangealex-form.scss';
import FormInput from '@/shared/components/common/forms/inputs/FormInput';
// import FormSelect from '@/shared/components/common/forms/inputs/FormSelect';
import FormTextarea from '@/shared/components/common/forms/inputs/FormTextarea';
import LoadingOverlay from '@/shared/components/ui/LoadingOverlay';
import { commonDefaultMessages } from '@/i18n/commonMessages';

export type PermissionFormValues = {
  permission_string: string;
  resource?: string | null;
  action?: string | null;
  scope?: string | null;
  description?: string | null;
};

type PermissionFormProps = {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<PermissionFormValues> | null;
  onSubmit: (values: PermissionFormValues) => void;
};

export default function PermissionForm({
  open,
  onClose,
  initialValues,
  onSubmit,
}: PermissionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PermissionFormValues>({
    defaultValues: {
      permission_string: initialValues?.permission_string ?? '',
      resource: initialValues?.resource ?? '',
      action: initialValues?.action ?? '',
      scope: initialValues?.scope ?? '',
      description: initialValues?.description ?? '',
    },
  });

  useEffect(() => {
    reset({
      permission_string: initialValues?.permission_string ?? '',
      resource: initialValues?.resource ?? '',
      action: initialValues?.action ?? '',
      scope: initialValues?.scope ?? '',
      description: initialValues?.description ?? '',
    });
  }, [initialValues, reset]);

  if (!open) return null;

  const onValid = (data: PermissionFormValues) => onSubmit(data);

  return (
    <div className="orangealex-form oa-form--md oa-form--left">
      <SectionHeader
        title={initialValues ? m.editTitle : m.newTitle}
        icon={faKey}
        onBack={onClose}
      />
      <form onSubmit={handleSubmit(onValid)} className="orangealex-form__body">
        <LoadingOverlay open={isSubmitting} message={commonDefaultMessages.saving} />
        <div className="orangealex-form__grid">
          <FormInput
            wrapperClassName="form-field--full"
            label={m.fields.permissionString}
            {...register('permission_string', {
              required: m.errors.permissionStringRequired,
              minLength: { value: 5, message: m.errors.max80 },
              maxLength: { value: 80, message: m.errors.max80 },
              pattern: {
                value: /^[a-z]+:[a-z]+:[a-z]+(-[a-z]+)?$/i,
                message: m.errors.permissionStringFormat,
              },
            })}
            error={errors.permission_string?.message}
          />
          <FormInput
            label={m.fields.resource}
            {...register('resource', {
              maxLength: { value: 40, message: m.errors.max40 },
            })}
            error={errors.resource?.message}
          />
          <FormInput
            label={m.fields.action}
            {...register('action', {
              maxLength: { value: 40, message: m.errors.max40 },
            })}
            error={errors.action?.message}
          />
          <FormInput
            label={m.fields.scope}
            {...register('scope', {
              maxLength: { value: 40, message: m.errors.max40 },
            })}
            error={errors.scope?.message}
          />
          <FormTextarea
            wrapperClassName="form-field--full"
            label={m.fields.description}
            {...register('description', {
              maxLength: { value: 255, message: m.errors.max255 },
            })}
            error={errors.description?.message}
          />
        </div>

        <div className="orangealex-form__footer">
          <FormActions
            onCancel={onClose}
            onAccept={() => {}}
            isAccepting={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
