import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUsersCrud } from '@/features/security';
import { apiCall } from '@/shared/api/apiCall';
// removed unused API/helper imports
import { userSchema, UserFormValues } from './validationSchema';
// removed unused userFormMessages import
import './UserForm.scss';
import SectionHeader from '@/shared/components/common/SectionHeader';
// removed unused Button import
import { usersMessages } from './Users.messages';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import FormActions from '@/shared/components/common/FormActions';
import LoadingOverlay from '@/shared/components/ui/LoadingOverlay';
import { commonDefaultMessages } from '@/i18n/commonMessages';
import FormInput from '@/shared/components/common/forms/inputs/FormInput';
import FormSelect from '@/shared/components/common/forms/inputs/FormSelect';
// import FormTextarea from '@/shared/components/common/forms/inputs/FormTextarea';

// Aceptamos datos desde la lista (UserWithRole) y los mapeamos al shape del formulario
interface UsuarioCompleto extends UserFormValues {
  idUsuario: number;
}
// Revert to local UserWithRole to avoid missing module
type UserWithRole = {
  user_id: number;
  first_name?: string | null;
  second_name?: string | null;
  last_name_p?: string | null;
  last_name_m?: string | null;
  email?: string | null;
  username?: string | null;
  rolId?: number | null;
  is_active?: boolean;
  initials?: string | null;
  auth_provider?: string | null;
  phone_number?: string | null;
  mfa_enabled?: boolean | null;
  avatar_url?: string | null;
  bio?: string | null;
  azure_ad_object_id?: string | null;
  upn?: string | null;
  email_verified_at?: string | null;
  last_login_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  idUsuario?: number;
};

// removed unused UpdateUsuarioVariables interface

interface Props {
  initialData?: UsuarioCompleto | UserWithRole | null;
  onSubmit?: (values: UserFormValues) => Promise<void> | void;
  onCancel: () => void;
  readOnly?: boolean;
  hasEditPermission?: boolean;
}

const UserForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  onCancel,
  readOnly = false,
  hasEditPermission = true,
}) => {
  // removed unused query client

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
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
    if (!initialData) {
      reset();
      return;
    }
    const mapFromAny = (
      src: UsuarioCompleto | UserWithRole
    ): UserFormValues => {
      const asUser = src as UserWithRole;
      const asForm = src as UsuarioCompleto;
      const status =
        'status' in (src as UsuarioCompleto | Record<string, unknown>)
          ? (asForm.status ?? (asUser.is_active ? 'activo' : 'inactivo'))
          : asUser.is_active
            ? 'activo'
            : 'inactivo';
      return {
        idUsuario: (asForm.idUsuario ??
          (asUser.user_id as number | undefined)) as number | undefined,
        nombre: asForm.nombre ?? asUser.first_name ?? '',
        segundoNombre: asForm.segundoNombre ?? asUser.second_name ?? '',
        apellidoPaterno: asForm.apellidoPaterno ?? asUser.last_name_p ?? '',
        apellidoMaterno: asForm.apellidoMaterno ?? asUser.last_name_m ?? '',
        correoElectronico: asForm.correoElectronico ?? asUser.email ?? '',
        nombreUsuario: asForm.nombreUsuario ?? asUser.username ?? '',
        rolId: asForm.rolId ?? asUser.rolId ?? undefined,
        status,
        initials: asForm.initials ?? asUser.initials ?? '',
        auth_provider: asForm.auth_provider ?? asUser.auth_provider ?? '',
        phone_number: asForm.phone_number ?? asUser.phone_number ?? '',
        mfa_enabled: asForm.mfa_enabled ?? asUser.mfa_enabled ?? false,
        avatar_url: asForm.avatar_url ?? asUser.avatar_url ?? '',
        bio: asForm.bio ?? asUser.bio ?? '',
        azure_ad_object_id:
          asForm.azure_ad_object_id ?? asUser.azure_ad_object_id ?? '',
        upn: asForm.upn ?? asUser.upn ?? '',
        email_verified_at:
          asForm.email_verified_at ?? asUser.email_verified_at ?? '',
        last_login_at: asForm.last_login_at ?? asUser.last_login_at ?? '',
        created_at: asForm.created_at ?? asUser.created_at ?? '',
        updated_at: asForm.updated_at ?? asUser.updated_at ?? '',
      };
    };
    reset(mapFromAny(initialData));
  }, [initialData, reset]);

  const { create: createMutation, update: updateMutation } = useUsersCrud();

  const submit = async (data: UserFormValues) => {
    await apiCall(
      () => Promise.resolve(onSubmit?.(data) as unknown as Promise<void>),
      { where: 'security.users.form.submit', toastOnError: true }
    );
  };

  return (
    <div className="global-form global-form--md global-form--left">
      <SectionHeader
        title={
          initialData
            ? readOnly
              ? 'Detalle de usuario'
              : usersMessages.editUser
            : usersMessages.createUser
        }
        icon={faUser}
        onBack={onCancel}
      />
      <form
        onSubmit={handleSubmit(async (data) => {
          if (readOnly || !hasEditPermission) return; // abort submit
          await submit(data);
        })}
        className="global-form__body"
      >
        <LoadingOverlay
          open={
            isSubmitting || createMutation.isPending || updateMutation.isPending
          }
          message={usersMessages.savingUser ?? commonDefaultMessages.saving}
        />
        <div className="global-form__grid">
          {/* Fila 1: 4 columnas */}
          <FormInput
            label={usersMessages.form?.nombre ?? 'Nombre'}
            {...register('nombre')}
            error={errors.nombre?.message}
            disabled={readOnly}
          />
          <FormInput
            label={usersMessages.form?.segundoNombre ?? 'Segundo nombre'}
            {...register('segundoNombre')}
            disabled={readOnly}
          />
          <FormInput
            label={usersMessages.form?.apellidoPaterno ?? 'Apellido paterno'}
            {...register('apellidoPaterno')}
            disabled={readOnly}
          />
          <FormInput
            label={usersMessages.form?.apellidoMaterno ?? 'Apellido materno'}
            {...register('apellidoMaterno')}
            disabled={readOnly}
          />
          {/* Fila 2: correo span-3 + usuario */}
          <FormInput
            wrapperClassName="form-field--span-3"
            label={
              usersMessages.form?.correoElectronico ?? 'Correo electrónico'
            }
            {...register('correoElectronico')}
            error={errors.correoElectronico?.message}
            disabled={readOnly}
          />
          <FormInput
            label={usersMessages.form?.nombreUsuario ?? 'Usuario'}
            {...register('nombreUsuario')}
            error={errors.nombreUsuario?.message}
            disabled={readOnly}
          />
          {/* Fila 3: rol, estatus, iniciales, proveedor */}
          <FormInput
            type="number"
            label={usersMessages.form?.rolId ?? 'Rol (id)'}
            {...register('rolId', { valueAsNumber: true })}
            error={errors.rolId?.message}
            disabled={readOnly}
          />
          <FormSelect
            label={usersMessages.form?.status}
            {...register('status')}
            disabled={readOnly}
          >
            <option value="activo">
              {usersMessages.form?.statusActivo ?? 'Activo'}
            </option>
            <option value="inactivo">
              {usersMessages.form?.statusInactivo ?? 'Inactivo'}
            </option>
          </FormSelect>
          <FormInput
            label={usersMessages.form?.initials ?? 'Iniciales'}
            {...register('initials')}
            disabled={readOnly}
          />
          <FormInput
            label={usersMessages.form?.auth_provider ?? 'Proveedor'}
            {...register('auth_provider')}
            disabled={readOnly}
          />
          {/* Fila 4: teléfono, MFA, avatar span-2 */}
          <FormInput
            label={usersMessages.form?.phone_number ?? 'Teléfono'}
            {...register('phone_number')}
            disabled={readOnly}
          />
          <FormSelect
            label={usersMessages.form?.mfa_enabled}
            {...register('mfa_enabled', {
              setValueAs: (v) =>
                typeof v === 'boolean' ? v : String(v) === 'true',
            })}
            disabled={readOnly}
          >
            <option value="false">{commonDefaultMessages.no}</option>
            <option value="true">{commonDefaultMessages.yes}</option>
          </FormSelect>
          <FormInput
            wrapperClassName="form-field--span-2"
            label={usersMessages.form?.avatar_url ?? 'Avatar URL'}
            {...register('avatar_url')}
            disabled={readOnly}
          />
          {/* Fila 5: bio span-2, azure, upn */}
          <FormInput
            wrapperClassName="form-field--span-2"
            label={usersMessages.form?.bio ?? 'Bio'}
            {...register('bio')}
            disabled={readOnly}
          />
          <FormInput
            label={
              usersMessages.form?.azure_ad_object_id ?? 'Azure AD Object Id'
            }
            {...register('azure_ad_object_id')}
            disabled={readOnly}
          />
          <FormInput
            label={usersMessages.form?.upn ?? 'UPN'}
            {...register('upn')}
            disabled={readOnly}
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
        <div className="global-form__footer">
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
