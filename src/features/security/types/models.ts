export interface IUser {
  userId: number;
  username: string;
  passwordHash: string;
  firstName: string;
  secondName: string | null;
  lastNameP: string;
  lastNameM: string | null;
  initials: string | null;
  email: string;
  authProvider: string | null;
  emailVerifiedAt: Date | null;
  avatarUrl: string | null;
  bio: string | null;
  phoneNumber: string | null;
  azureAdObjectId: string | null;
  upn: string | null;
  lastLoginAt: Date | null;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  isActive: boolean;
  mfaEnabled: boolean;
}

export interface IRole {
  roleId: number;
  name: string;
  description: string | null;
}

export interface IPermission {
  permissionId: number;
  permissionKey: string;
  resource: string | null;
  scope: string | null;
  action: string | null;
  description: string | null;
}

export interface IMenu {
  menuId: number;
  title: string;
  iconKey: string;
  route: string;
  permissionId: number | null;
  permissionString: string | null;
  items?: IMenu[] | null;
  kind?: 'divider' | null;
}

export interface IUserSession extends IUser {
  permissions: IPermission[];
  roles: IRole[];
  fullName: string;
}