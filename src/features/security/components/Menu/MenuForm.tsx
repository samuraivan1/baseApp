import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SectionHeader from '@/shared/components/common/SectionHeader';
import FormInput from '@/shared/components/common/forms/inputs/FormInput';
import FormActions from '@/shared/components/common/FormActions';
import { menuMessages } from './Menu.messages';
import { menuSchema, type MenuFormValues } from './menu.schema';
import type { IMenu } from '@/features/security/types/models';

type MenuFormProps = {
  open: boolean;
  readOnly?: boolean;
  hasEditPermission?: boolean;
  initialValues?: Partial<IMenu>; // Use IMenu for initial values
  onClose: () => void;
  onSubmit: (values: MenuFormValues) => void | Promise<void>;
};

const MenuForm: React.FC<MenuFormProps> = ({
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
    formState: { errors },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    mode: 'onBlur',
    defaultValues: {
      title: initialValues?.title ?? '',
      iconKey: initialValues?.iconKey ?? '',
      route: initialValues?.route ?? '',
      permissionString: initialValues?.permissionString ?? '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      setValue('title', initialValues.title ?? '');
      setValue('iconKey', initialValues.iconKey ?? '');
      setValue('route', initialValues.route ?? '');
      setValue('permissionString', initialValues.permissionString ?? '');
    }
  }, [initialValues, setValue]);

  const disabled = readOnly;

  const onValid = async (data: MenuFormValues) => {
    if (readOnly) return;
    await onSubmit(data);
  };

  return (
    <div className="global-form oa-form--md oa-form--left menu-form">
      {open ? (
        <>
          <SectionHeader
            title={menuMessages.form.title}
            icon={undefined} // Add an icon if desired
            onBack={onClose}
          />
          <form onSubmit={rhfSubmit(onValid)} className="global-form__body" noValidate>
            <div className="global-form__grid">
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <FormInput
                    label={menuMessages.form.title}
                    id="title"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={menuMessages.form.titlePlaceholder}
                    error={errors.title?.message}
                    disabled={disabled}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name="iconKey"
                render={({ field }) => (
                  <FormInput
                    label={menuMessages.form.iconKey}
                    id="iconKey"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={menuMessages.form.iconKeyPlaceholder}
                    error={errors.iconKey?.message}
                    disabled={disabled}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name="route"
                render={({ field }) => (
                  <FormInput
                    label={menuMessages.form.route}
                    id="route"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={menuMessages.form.routePlaceholder}
                    error={errors.route?.message}
                    disabled={disabled}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name="permissionString"
                render={({ field }) => (
                  <FormInput
                    label={menuMessages.form.permissionString}
                    infoTooltip={menuMessages.hints?.permissionOptional}
                    id="permissionString"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    placeholder={menuMessages.form.permissionStringPlaceholder}
                    error={errors.permissionString?.message}
                    disabled={disabled}
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
                        label: menuMessages.requestEdit,
                        onClick: () =>
                          document.dispatchEvent(
                            new CustomEvent('menuform:request-edit')
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

export default MenuForm;
