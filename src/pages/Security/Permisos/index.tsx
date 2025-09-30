import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import logger from '@/services/logger';
import { getPermissions, deletePermission } from '@/features/security/api/permissionService';
import { permisosMessages } from './Permisos.messages';
import './Permisos.scss';
import Button from '@/components/ui/Button';
import FormSection from '@/components/form/FormSection';
import type { Permission } from '@/types/security';

const PermisosPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: permisos, isLoading } = useQuery({
    queryKey: ['permisos'],
    queryFn: getPermissions,
  });

  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const delMutation = useMutation({
    mutationFn: (id: number) => deletePermission(id),
    onSuccess: () => {
      toast.success(permisosMessages.deleteSuccess);
      queryClient.invalidateQueries({ queryKey: ['permisos'] });
    },
    onError: (err: unknown) => {
      const error = err instanceof Error ? err : new Error('Error eliminando permiso');
      logger.error(error, err);
      toast.error(permisosMessages.genericError);
    },
    onSettled: () => setDeletingId(null),
  });

  return (
    <div className="segu-permisos">
      <FormSection title={permisosMessages.title}>
        {isLoading ? (
          <p>{permisosMessages.loading}</p>
        ) : (
          <div className="fs-row-span-2 fs-table-container">
            <table className="segu-permisos__table" style={{ width: 'max-content' }}>
              <thead>
                <tr>
                  <th>{permisosMessages.table.key}</th>
                  <th>{permisosMessages.table.resource}</th>
                  <th>{permisosMessages.table.action}</th>
                  <th>{permisosMessages.table.scope}</th>
                  <th>{permisosMessages.table.description}</th>
                  <th>{permisosMessages.table.actions}</th>
                </tr>
              </thead>
              <tbody>
                {permisos?.map((p: Permission) => (
                  <tr key={p.permission_id}>
                    <td className="cell--nowrap">{p.permission_string}</td>
                    <td>{p.resource}</td>
                    <td>{p.action}</td>
                    <td>{p.scope}</td>
                    <td>{p.description}</td>
                    <td>
                      <Button
                        variant="danger"
                        isLoading={deletingId === p.permission_id}
                        disabled={deletingId != null}
                        onClick={() => {
                          setDeletingId(p.permission_id);
                          delMutation.mutate(p.permission_id);
                        }}
                      >
                        {permisosMessages.delete}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FormSection>
    </div>
  );
};

export default PermisosPage;
