/**
 * Public API for the Security feature.
 * Only exports modules that are intended to be used by other features or layers.
 */
export type {
  IUserSession as UserSession,
  IUser as User,
  IPermission as Permission,
} from '@/features/security/types/models';
