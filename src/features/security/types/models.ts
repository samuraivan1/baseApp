/** Rol de seguridad del sistema. */
export interface IRole {
  /** Identificador del rol (dominio). */
  readonly roleId: number;
  /** Nombre legible del rol. */
  name: string;
  /** Descripción opcional del rol. */
  description?: string | null;
}

/** Permiso granular que habilita acciones sobre recursos. */
export interface IPermission {
  /** Identificador del permiso (dominio). */
  readonly permissionId: number;
  /** Clave única del permiso. */
  permissionKey: string;
  /** Recurso asociado opcional. */
  resource?: string | null;
  /** Ámbito opcional (mock). */
  scope?: string | null;
  /** Acción opcional (mock). */
  action?: string | null;
  /** Descripción del permiso. */
  description?: string | null;
}

/** Usuario de la plataforma. */
export interface IUser {
  /** Identificador del usuario (dominio). */
  readonly userId: number;
  /** Nombre de usuario. */
  username: string;
  /** Hash de la contraseña (no exponer en UI). */
  passwordHash: string;
  /** Nombre(s). */
  firstName: string;
  /** Segundo nombre opcional. */
  secondName?: string | null;
  /** Apellido paterno. */
  lastNameP: string;
  /** Apellido materno opcional. */
  lastNameM?: string | null;
  /** Iniciales opcionales. */
  initials?: string | null;
  /** Correo electrónico. */
  email: string;
  /** Proveedor de autenticación (opc). */
  authProvider?: string | null;
  /** Fecha verificación email (UI). */
  emailVerifiedAt?: Date | null;
  /** Avatar URL opcional. */
  avatarUrl?: string | null;
  /** Biografía opcional. */
  bio?: string | null;
  /** Teléfono opcional. */
  phoneNumber?: string | null;
  /** Azure AD Object ID (opc). */
  azureAdObjectId?: string | null;
  /** UPN opcional. */
  upn?: string | null;
  /** Último acceso (UI). */
  lastLoginAt?: Date | null;
  /** Creación (UI). */
  createdAt?: Date;
  /** Actualización (UI). */
  updatedAt?: Date;
  /** Estado activo (UI). */
  isActive: boolean;
  /** MFA habilitado (UI). */
  mfaEnabled: boolean;
}

/** Información de sesión de usuario autenticado. */
export interface IUserSession {
  /** Identificador del usuario. */ readonly userId: number;
  username: string;
  email: string;
  firstName: string;
  lastNameP: string;
  lastNameM?: string | null;
  initials?: string | null;
  isActive: boolean;
  mfaEnabled: boolean;
  roles: IRole[];
  permissions: IPermission[];
  fullName: string;
}
