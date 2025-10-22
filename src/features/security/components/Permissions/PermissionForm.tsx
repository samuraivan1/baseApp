import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SectionHeader from '@/shared/components/common/SectionHeader';
import FormInput from '@/shared/components/common/forms/inputs/FormInput';
import FormTextarea from '@/shared/components/common/forms/inputs/FormTextarea';
import FormActions from '@/shared/components/common/FormActions';
import { permissionsMessages } from '../Permissions/Permissions.messages';
import {
  permissionSchema,
  type PermissionFormValues,
} from '../Permissions/permission.schema';

// Tipado derivado desde Zod (permission.schema.ts)

type PermissionFormProps = {
  open: boolean;
  readOnly?: boolean;
  hasEditPermission?: boolean;
  initialValues?: Partial<PermissionFormValues>;
  onClose: () => void;
  onSubmit: (values: PermissionFormValues) => void | Promise<void>;
};

// Formulario embebido, enfocado en lectura; sin any y usando componentes compartidos.
const PermissionForm: React.FC<PermissionFormProps> = ({
  open,
  readOnly = true,
  hasEditPermission = false,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const {
    handleSubmit: rhfSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    mode: 'onBlur',
    defaultValues: {
      permission_string: String(initialValues?.permission_string ?? ''),
      resource: String(initialValues?.resource ?? ''),
      action: String(initialValues?.action ?? ''),
      scope: String(initialValues?.scope ?? ''),
      description: String(initialValues?.description ?? ''),
    },
  });

  React.useEffect(() => {
    setValue(
      'permission_string',
      String(initialValues?.permission_string ?? '')
    );
    setValue('resource', String(initialValues?.resource ?? ''));
    setValue('action', String(initialValues?.action ?? ''));
    setValue('scope', String(initialValues?.scope ?? ''));
    setValue('description', String(initialValues?.description ?? ''));
  }, [initialValues, setValue]);

  const disabled = readOnly;
  const isCreate = !initialValues || !initialValues.permission_string;

  // Autogenera la clave en alta concatenando recurso.acción.ámbito
  const wRes = watch('resource');
  const wAct = watch('action');
  const wScp = watch('scope');
  React.useEffect(() => {
    if (!isCreate) return;
    const key = [wRes, wAct, wScp]
      .map((s) => String(s ?? '').trim())
      .filter(Boolean)
      .join('.');
    setValue('permission_string', key, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [wRes, wAct, wScp, isCreate, setValue]);

  const handleChange = (key: keyof PermissionFormValues, val: string) => {
    if (key === 'resource' || key === 'action' || key === 'scope') {
      const normalized = val
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '')
        .slice(0, 15);
      setValue(key, normalized, { shouldValidate: true, shouldDirty: true });
      return;
    }
    setValue(key, val, { shouldValidate: true, shouldDirty: true });
  };

  // Validación delegada a Zod por zodResolver

  const onValid = async (data: PermissionFormValues) => {
    if (readOnly) return;
    const next: PermissionFormValues = {
      permission_string: String(data.permission_string || '').trim(),
      resource: String(data.resource || '').trim(),
      action: String(data.action || '').trim(),
      scope: String(data.scope || '').trim(),
      description: String(data.description || '').trim(),
    };
    await onSubmit(next);
  };

  return (
    <div className="global-form oa-form--lg oa-form--left">
      {open ? (
        <>
          <SectionHeader
            title={permissionsMessages.form.title}
            icon={undefined}
            onBack={onClose}
          />
          <form
            onSubmit={rhfSubmit(onValid)}
            className="global-form__body"
            noValidate
          >
            <div className="global-form__grid">
              {/* Fila 1: Recurso, Acción, Ámbito */}
              <Controller
                control={control}
                name="resource"
                render={({ field }) => (
                  <FormInput
                    label={permissionsMessages.form.resource}
                    infoTooltip={
                      permissionsMessages.hints?.onlyLowerNumUnderscoreMax15
                    }
                    id="resource"
                    name="resource"
                    value={field.value}
                    onChange={(e) => handleChange('resource', e.target.value)}
                    placeholder={permissionsMessages.form.resourcePlaceholder}
                    autoComplete="off"
                    error={errors.resource?.message}
                    disabled={disabled}
                    required
                    aria-invalid={!!errors.resource}
                    aria-describedby={
                      errors.resource ? 'resource-error' : undefined
                    }
                  />
                )}
              />
              <Controller
                control={control}
                name="action"
                render={({ field }) => (
                  <FormInput
                    label={permissionsMessages.form.action}
                    infoTooltip={
                      permissionsMessages.hints?.onlyLowerNumUnderscoreMax15
                    }
                    tooltipPlacement="top"
                    id="action"
                    name="action"
                    value={field.value}
                    onChange={(e) => handleChange('action', e.target.value)}
                    placeholder={permissionsMessages.form.actionPlaceholder}
                    autoComplete="off"
                    error={errors.action?.message}
                    disabled={disabled}
                    required
                    aria-invalid={!!errors.action}
                    aria-describedby={
                      errors.action ? 'action-error' : undefined
                    }
                  />
                )}
              />
              <Controller
                control={control}
                name="scope"
                render={({ field }) => (
                  <FormInput
                    label={permissionsMessages.form.scope}
                    infoTooltip={
                      permissionsMessages.hints?.onlyLowerNumUnderscoreMax15
                    }
                    tooltipPlacement="top"
                    id="scope"
                    name="scope"
                    value={field.value}
                    onChange={(e) => handleChange('scope', e.target.value)}
                    placeholder={permissionsMessages.form.scopePlaceholder}
                    autoComplete="off"
                    error={errors.scope?.message}
                    disabled={disabled}
                    required
                    aria-invalid={!!errors.scope}
                    aria-describedby={errors.scope ? 'scope-error' : undefined}
                  />
                )}
              />

              {/* Fila 2: Cadena del permiso (readonly) */}
              <Controller
                control={control}
                name="permission_string"
                render={({ field }) => (
                  <FormInput
                    wrapperClassName="form-field--full form-field--readonly"
                    label={permissionsMessages.form.key}
                    infoTooltip={
                      permissionsMessages.hints?.autoGeneratedKey ||
                      'Se genera automáticamente'
                    }
                    tooltipPlacement="top"
                    id="permission_string"
                    name="permission_string"
                    value={field.value}
                    onChange={(e) =>
                      handleChange('permission_string', e.target.value)
                    }
                    placeholder={permissionsMessages.form.keyPlaceholder}
                    readOnly
                    disabled
                    required
                    aria-invalid={!!errors.permission_string}
                    aria-describedby={
                      errors.permission_string
                        ? 'permission_string-error'
                        : undefined
                    }
                  />
                )}
              />

              {/* Fila 3: Descripción */}
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <FormTextarea
                    wrapperClassName="form-field--full"
                    id="description"
                    name="description"
                    label={permissionsMessages.form.description}
                    value={field.value}
                    onChange={(e) =>
                      handleChange('description', e.target.value)
                    }
                    placeholder={
                      permissionsMessages.form.descriptionPlaceholder
                    }
                    autoComplete="off"
                    disabled={disabled}
                    rows={4}
                    required
                    aria-invalid={!!errors.description}
                    aria-describedby={
                      errors.description ? 'description-error' : undefined
                    }
                  />
                )}
              />
            </div>

            <div className="global-form__footer">
              <FormActions
                onCancel={onClose}
                onAccept={rhfSubmit(onValid)}
                auxAction={
                  hasEditPermission && readOnly
                    ? {
                        label: permissionsMessages.requestEdit,
                        onClick: () =>
                          document.dispatchEvent(
                            new CustomEvent('permissionform:request-edit')
                          ),
                      }
                    : undefined
                }
              />
            </div>
          </form>
        </>
      ) : null}
    </div>
  );
};

export default PermissionForm;
