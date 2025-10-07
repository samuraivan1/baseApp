import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateUser, useUpdateUser } from '@/features/security';
import { toast } from 'react-toastify';
import logger from '@/shared/api/logger';
import { createUser, updateUser } from '@/features/security';
import {
  toCreateUserDto,
  toUpdateUserDto,
} from '@/features/security';
import {
  addUserRole,
  getUserRoles,
  removeUserRole,
} from '@/features/security';
import { userSchema, UserFormValues } from './validationSchema';
import { userFormMessages } from './UserForm.messages';
import './UserForm.scss';
import '@/shared/components/common/forms/orangealex-form.scss';
import SectionHeader from '@/shared/components/common/SectionHeader';
import { usersMessages } from './Users.messages';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import FormActions from '@/shared/components/common/FormActions';
import LoadingOverlay from '@/shared/components/ui/LoadingOverlay';
import { commonDefaultMessages } from '@/i18n/commonMessages';
import FormInput from '@/shared/components/common/forms/inputs/FormInput';
import FormSelect from '@/shared/components/common/forms/inputs/FormSelect';
// import FormTextarea from '@/shared/components/common/forms/inputs/FormTextarea';

interface UsuarioCompleto extends UserFormValues {
  idUsuario: number;
}

interface UpdateUsuarioVariables {
  id: number;
  payload: UserFormValues;
}

interface Props {
  initialData?: UsuarioCompleto | null;
  onSubmit?: (values: UserFormValues) => Promise<void> | void;
  onCancel: () => void;
}

const UserForm: React.FC<Props> = ({ initialData, onSubmit, onCancel }) => {
  const _qc = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData ?? {
      nombre: '',
      segundoNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      correoElectronico: '',
      nombreUsuario: '',
      rolId: undefined,
      status: 'activo',
      initials: '',
      auth_provider: '',
      phone_number: '',
      mfa_enabled: false,
      avatar_url: '',
      bio: '',
      azure_ad_object_id: '',
      upn: '',
      email_verified_at: '',
      last_login_at: '',
      created_at: '',
      updated_at: '',
    },
  });

  useEffect(() => {
    const fullShape: UserFormValues = {
      idUsuario: initialData?.idUsuario,
      nombre: initialData?.nombre ?? '',
      segundoNombre: initialData?.segundoNombre ?? '',
      apellidoPaterno: initialData?.apellidoPaterno ?? '',
      apellidoMaterno: initialData?.apellidoMaterno ?? '',
      correoElectronico: initialData?.correoElectronico ?? '',
      nombreUsuario: initialData?.nombreUsuario ?? '',
      rolId: initialData?.rolId,
      status: initialData?.status ?? 'activo',
      initials: initialData?.initials ?? '',
      auth_provider: initialData?.auth_provider ?? '',
      phone_number: initialData?.phone_number ?? '',
      mfa_enabled: initialData?.mfa_enabled ?? false,
      avatar_url: initialData?.avatar_url ?? '',
      bio: initialData?.bio ?? '',
      azure_ad_object_id: initialData?.azure_ad_object_id ?? '',
      upn: initialData?.upn ?? '',
      email_verified_at: initialData?.email_verified_at ?? '',
      last_login_at: initialData?.last_login_at ?? '',
      created_at: initialData?.created_at ?? '',
      updated_at: initialData?.updated_at ?? '',
    };
    // Reset siempre con el shape completo, incluso al crear
    reset(fullShape);
  }, [initialData, reset]);

  const createMutation = useCreateUser();
  const createUserWrapped = async (payload: UserFormValues) => {
    const created = await createUser(toCreateUserDto(payload));
    if (payload.rolId != null) {
      try {
        await addUserRole(created.user_id, Number(payload.rolId));
      } catch {
        // noop: asignar rol es best-effort tras crear usuario
      }
    }
    return created;
  };

  const updateMutation = useUpdateUser();
  const updateUserWrapped = async ({ id, payload }: UpdateUsuarioVariables) => {
    const updated = await updateUser(id, toUpdateUserDto(payload));

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
  };

  const submit = async (data: UserFormValues) => {
    try {
      await onSubmit?.(data);
    } catch (err) {
      logger.error(err, { context: 'submitUsuario' });
      toast.error(userFormMessages.genericError);
    }
  };

  return (
    <div className="orangealex-form oa-form--md oa-form--left">
      <SectionHeader
        title={initialData ? usersMessages.editUser : usersMessages.createUser}
        icon={faUser}
        onBack={onCancel}
      />
      <form className="user-form" onSubmit={handleSubmit(submit)}>
        <LoadingOverlay
          open={
            isSubmitting || createMutation.isPending || updateMutation.isPending
          }
          message={usersMessages.savingUser ?? commonDefaultMessages.saving}
        />
        <div className="orangealex-form__grid">
          {/* Fila 1: 4 columnas */}
          <FormInput
            label={usersMessages.form?.nombre ?? 'Nombre'}
            {...register('nombre')}
            error={errors.nombre?.message}
          />
          <FormInput
            label={usersMessages.form?.segundoNombre ?? 'Segundo nombre'}
            {...register('segundoNombre')}
          />
          <FormInput
            label={usersMessages.form?.apellidoPaterno ?? 'Apellido paterno'}
            {...register('apellidoPaterno')}
          />
          <FormInput
            label={usersMessages.form?.apellidoMaterno ?? 'Apellido materno'}
            {...register('apellidoMaterno')}
          />
          {/* Fila 2: correo span-3 + usuario */}
          <FormInput
            wrapperClassName="form-field--span-3"
            label={
              usersMessages.form?.correoElectronico ?? 'Correo electrónico'
            }
            {...register('correoElectronico')}
            error={errors.correoElectronico?.message}
          />
          <FormInput
            label={usersMessages.form?.nombreUsuario ?? 'Usuario'}
            {...register('nombreUsuario')}
            error={errors.nombreUsuario?.message}
          />
          {/* Fila 3: rol, estatus, iniciales, proveedor */}
          <FormInput
            type="number"
            label={usersMessages.form?.rolId ?? 'Rol (id)'}
            {...register('rolId', { valueAsNumber: true })}
            error={errors.rolId?.message}
          />
          <FormSelect
            label={usersMessages.form?.status}
            {...register('status')}
          >
            <option value="activo">{usersMessages.form?.statusActivo ?? 'Activo'}</option>
            <option value="inactivo">{usersMessages.form?.statusInactivo ?? 'Inactivo'}</option>
          </FormSelect>
          <FormInput
            label={usersMessages.form?.initials ?? 'Iniciales'}
            {...register('initials')}
          />
          <FormInput
            label={usersMessages.form?.auth_provider ?? 'Proveedor'}
            {...register('auth_provider')}
          />
          {/* Fila 4: teléfono, MFA, avatar span-2 */}
          <FormInput
            label={usersMessages.form?.phone_number ?? 'Teléfono'}
            {...register('phone_number')}
          />
          <FormSelect
            label={usersMessages.form?.mfa_enabled}
            {...register('mfa_enabled', {
              setValueAs: (v) =>
                typeof v === 'boolean' ? v : String(v) === 'true',
            })}
          >
            <option value="false">{commonDefaultMessages.no}</option>
            <option value="true">{commonDefaultMessages.yes}</option>
          </FormSelect>
          <FormInput
            wrapperClassName="form-field--span-2"
            label={usersMessages.form?.avatar_url ?? 'Avatar URL'}
            {...register('avatar_url')}
          />
          {/* Fila 5: bio span-2, azure, upn */}
          <FormInput
            wrapperClassName="form-field--span-2"
            label={usersMessages.form?.bio ?? 'Bio'}
            {...register('bio')}
          />
          <FormInput
            label={
              usersMessages.form?.azure_ad_object_id ?? 'Azure AD Object Id'
            }
            {...register('azure_ad_object_id')}
          />
          <FormInput
            label={usersMessages.form?.upn ?? 'UPN'}
            {...register('upn')}
          />
          {/* Metadatos: 2x2 en filas separadas */}
          <FormInput
            label={usersMessages.form?.email_verified_at ?? 'Email verificado'}
            {...register('email_verified_at')}
            readOnly
          />
          <FormInput
            label={usersMessages.form?.last_login_at ?? 'Último acceso'}
            {...register('last_login_at')}
            readOnly
          />
          <FormInput
            label={usersMessages.form?.created_at ?? 'Creado'}
            {...register('created_at')}
            readOnly
          />
          <FormInput
            label={usersMessages.form?.updated_at ?? 'Actualizado'}
            {...register('updated_at')}
            readOnly
          />
        </div>
        <div className="user-form__actions">
          <FormActions
            onCancel={onCancel}
            onAccept={() => {}}
            isAccepting={
              isSubmitting ||
              createMutation.isPending ||
              updateMutation.isPending
            }
          />
        </div>
      </form>
    </div>
  );
};

export default UserForm;
