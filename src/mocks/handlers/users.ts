import { createCrudHandlers } from './crudFactory';
import { UserSchema } from '@/features/security/types/schemas';
import { PERMISSIONS } from '@/features/security/constants/permissions';

export const usersHandlers = createCrudHandlers({
  tableName: 'users',
  idField: 'user_id',
  schema: UserSchema,
  permissions: {
    view: PERMISSIONS.SECURITY_USERS_VIEW,
    create: PERMISSIONS.SECURITY_USERS_CREATE,
    update: PERMISSIONS.SECURITY_USERS_UPDATE,
    delete: PERMISSIONS.SECURITY_USERS_DELETE,
  },
});
