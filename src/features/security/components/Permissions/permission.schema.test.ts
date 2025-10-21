import { describe, it, expect } from 'vitest';
import { permissionSchema } from '../Permissions/permission.schema';

describe('permissionSchema', () => {
  const base = {
    resource: 'overview',
    action: 'view',
    scope: 'security',
    description: 'Ver la página principal de Seguridad',
    permission_string: 'overview.view.security',
  };

  it('valida un payload correcto', () => {
    const parsed = permissionSchema.parse(base);
    expect(parsed).toEqual(base);
  });

  it('falla si resource tiene mayúsculas o símbolos', () => {
    expect(() =>
      permissionSchema.parse({ ...base, resource: 'Over-view' })
    ).toThrow();
  });

  it('falla si action supera 15 caracteres', () => {
    expect(() =>
      permissionSchema.parse({ ...base, action: 'abcdefghijklmnop' })
    ).toThrow();
  });

  it('falla si falta description', () => {
    expect(() =>
      permissionSchema.parse({ ...base, description: '' })
    ).toThrow();
  });

  it('falla si permission_string supera 200', () => {
    const long = 'a'.repeat(201);
    expect(() =>
      permissionSchema.parse({ ...base, permission_string: long })
    ).toThrow();
  });
});
