import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import SectionHeader from '@/shared/components/common/SectionHeader';
// removed unused Button import
import FormActions from '@/shared/components/common/FormActions';
import { permissionFormMessages as m } from './PermissionForm.messages';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import '@/shared/components/common/forms/orangealex-form.scss';
import FormInput from '@/shared/components/common/forms/inputs/FormInput';
// import FormSelect from '@/shared/components/common/forms/inputs/FormSelect';
import FormTextarea from '@/shared/components/common/forms/inputs/FormTextarea';
import LoadingOverlay from '@/shared/components/ui/LoadingOverlay';
import { commonDefaultMessages } from '@/i18n/commonMessages';
import { mapAppErrorMessage } from '@/shared/utils/errorI18n';
import { toast } from 'react-toastify';

export type PermissionFormValues = {
  permission_string: string;
  resource: string;
  action: string;
  scope: string;
  description: string;
};

type PermissionFormProps = {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<PermissionFormValues> | null;
  onSubmit: (values: PermissionFormValues) => void;
  readOnly?: boolean;
  hasEditPermission?: boolean;
};

export default function PermissionForm({
  open,
  onClose,
  initialValues,
  onSubmit,
  readOnly = false,
  hasEditPermission = true,
}: PermissionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<PermissionFormValues>({
    defaultValues: {
      permission_string: initialValues?.permission_string ?? '',
      resource: (initialValues?.resource as string) ?? '',
      action: (initialValues?.action as string) ?? '',
      scope: (initialValues?.scope as string) ?? '',
      description: (initialValues?.description as string) ?? '',
    },
  });

  useEffect(() => {
    reset({
      permission_string: initialValues?.permission_string ?? '',
      resource: (initialValues?.resource as string) ?? '',
      action: (initialValues?.action as string) ?? '',
      scope: (initialValues?.scope as string) ?? '',
      description: (initialValues?.description as string) ?? '',
    });
  }, [initialValues, reset]);

  // Auto-construir clave a partir de resource:action:scope (minúsculas)
  const resource = watch('resource');
  const action = watch('action');
  const scope = watch('scope');
  useEffect(() => {
    const r = String(resource || '').toLowerCase();
    const a = String(action || '').toLowerCase();
    const s = String(scope || '').toLowerCase();
    const key = r && a && s ? `${r}:${a}:${s}` : '';
    setValue('permission_string', key, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [resource, action, scope, setValue]);

  if (!open) return null;

  const onValid = async (data: PermissionFormValues) => {
    if (readOnly || !hasEditPermission) return;
    try {
      await onSubmit(data);
    } catch (err) {
      toast.error(mapAppErrorMessage(err));
    }
  };

  return (
    <div className="orangealex-form oa-form--md oa-form--left">
      <SectionHeader
        title={initialValues ? (readOnly ? m.editTitle : m.editTitle) : m.newTitle}
        icon={faKey}
        onBack={onClose}
      />
      <form onSubmit={handleSubmit(onValid)} className="orangealex-form__body">
        <LoadingOverlay
          open={isSubmitting}
          message={commonDefaultMessages.saving}
        />
        <div className="orangealex-form__grid">
          {/* Recurso, Acción, Ámbito (snake_case minúsculas, requerido) */}
          <FormInput
            label={m.fields.resource}
            {...register('resource', {
              required: m.errors.permissionStringRequired,
              pattern: { value: /^[a-z0-9_]+$/, message: m.errors.onlyLowerNumUnderscore },
              maxLength: { value: 40, message: m.errors.max40 },
            })}
            disabled={readOnly}
            helperText={resource ? m.hints.onlyLowerNumUnderscore : undefined}
            error={errors.resource?.message}
          />
          <FormInput
            label={m.fields.action}
            {...register('action', {
              required: m.errors.permissionStringRequired,
              pattern: { value: /^[a-z0-9_]+$/, message: m.errors.onlyLowerNumUnderscore },
              maxLength: { value: 40, message: m.errors.max40 },
            })}
            disabled={readOnly}
            helperText={action ? m.hints.onlyLowerNumUnderscore : undefined}
            error={errors.action?.message}
          />
          <FormInput
            label={m.fields.scope}
            {...register('scope', {
              required: m.errors.permissionStringRequired,
              pattern: { value: /^[a-z0-9_]+$/, message: m.errors.onlyLowerNumUnderscore },
              maxLength: { value: 40, message: m.errors.max40 },
            })}
            disabled={readOnly}
            helperText={scope ? m.hints.onlyLowerNumUnderscore : undefined}
            error={errors.scope?.message}
          />

          {/* Clave generada automáticamente (solo lectura) */}
          <FormInput
            wrapperClassName="form-field--full form-field--readonly"
            label={m.fields.permissionString}
            {...register('permission_string', {
              required: m.errors.permissionStringRequired,
              pattern: {
                value: /^[a-z0-9_]+:[a-z0-9_]+:[a-z0-9_]+$/,
                message: m.errors.permissionStringFormat,
              },
              maxLength: { value: 80, message: m.errors.max80 },
            })}
            readOnly
            helperText={watch('permission_string') ? m.hints.autoGenerated : undefined}
            error={errors.permission_string?.message}
          />
          <FormTextarea
            wrapperClassName="form-field--full"
            label={m.fields.description}
            {...register('description', { required: m.errors.descriptionRequired, maxLength: { value: 255, message: m.errors.max255 } })}
            disabled={readOnly}
            error={errors.description?.message}
          />
        </div>

        <div className="orangealex-form__footer">
          <FormActions onCancel={onClose} onAccept={() => {}} isAccepting={isSubmitting} />
        </div>
      </form>
    </div>
  );
}
