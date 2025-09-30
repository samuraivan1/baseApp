// src/pages/Security/Roles/RoleForm.tsx
import EntityFormModal from '@/components/common/EntityFormModal';
import type { Role } from '@/types/security';

export interface RoleFormProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<Role>;
  onSubmit: (values: Partial<Role>) => void;
}

export default function RoleForm({
  open,
  onClose,
  initialValues,
  onSubmit,
}: RoleFormProps) {
  return (
    <EntityFormModal<Partial<Role>>
      title={initialValues ? 'Editar Rol' : 'Nuevo Rol'}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      initialValues={initialValues}
      fields={[
        { name: 'name', label: 'Nombre del Rol', required: true },
        { name: 'description', label: 'Descripción', type: 'textarea' },
      ]}
    />
  );
}

