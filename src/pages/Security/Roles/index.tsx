import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import logger from '@/services/logger';
import { getRoles, deleteRole, createRole, updateRole } from '@/features/security/api/roleService';
import RoleForm from './RoleForm';
import { rolesMessages } from './Roles.messages';
import './Roles.scss';
import type { Role } from '@/types/security';

import PageHeader from '@/components/common/PageHeader';
import CommandBar from '@/components/common/CommandBar';
import EntityTable, { ColumnDefinition } from '@/components/common/Entitytable';
import Pagination from '@/components/common/Pagination';
import DynamicFilter from '@/components/common/DynamicFilter';
import { FilterableColumn } from '@/components/common/DynamicFilter/types';
import Button from '@/components/ui/Button';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import FormSection from '@/components/form/FormSection';

const RolesPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const { data: roles, isLoading, refetch } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => {
      toast.success(rolesMessages.deleteSuccess);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (err: unknown) => {
      const error = err instanceof Error ? err : new Error('Error eliminando rol');
      logger.error(error, err);
      toast.error(rolesMessages.genericError);
    },
    onSettled: () => setDeletingId(null),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Role>) =>
      createRole({ name: payload.name ?? '', description: payload.description ?? null }),
    onSuccess: () => {
      toast.success(rolesMessages.created);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsModalOpen(false);
    },
    onError: (err: unknown) => {
      const error = err instanceof Error ? err : new Error('Error creando rol');
      logger.error(error, err);
      toast.error(rolesMessages.genericError);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Role> }) =>
      updateRole(id, { name: payload.name, description: payload.description }),
    onSuccess: () => {
      toast.success(rolesMessages.updated);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsModalOpen(false);
    },
    onError: (err: unknown) => {
      const error = err instanceof Error ? err : new Error('Error actualizando rol');
      logger.error(error, err);
      toast.error(rolesMessages.genericError);
    },
  });

  const handleOpenCreate = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const filteredRoles = useMemo(() => {
    if (!roles) return [];
    return roles.filter((role) => {
      const matchesSearchTerm = searchTerm === '' || role.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDynamicFilters = Object.entries(activeFilters).every(([field, value]) => {
        if (value === '') return true;
        const roleValue = role[field as keyof Role];
        return typeof roleValue === 'string' && roleValue.toLowerCase().includes(value.toLowerCase());
      });
      return matchesSearchTerm && matchesDynamicFilters;
    });
  }, [roles, searchTerm, activeFilters]);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return filteredRoles.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, rowsPerPage, filteredRoles]);

  const totalPages = Math.ceil(filteredRoles.length / rowsPerPage);
  const columns: ColumnDefinition<Role>[] = [
    { header: 'Rol', accessor: 'name', isPrincipal: true, nowrap: true },
    { header: 'Descripción', accessor: 'description' },
  ];
  const filterableColumns: FilterableColumn[] = [
    { key: 'name', label: 'Nombre de Rol' },
    { key: 'description', label: 'Descripción' },
  ];

  return (
    <div className="segu-page-container">
      <LoadingOverlay open={createMutation.isPending || updateMutation.isPending} message="Procesando rol..." />
      <PageHeader title={rolesMessages.title} titleSize="1.75rem" />
      <CommandBar
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        onAdd={handleOpenCreate}
        onRefresh={refetch}
        addLabel={rolesMessages.addLabel}
        searchLarge={true}
        searchPlaceholder="Buscar por nombre de rol..."
      />
      <DynamicFilter columns={filterableColumns} onFilterChange={setActiveFilters} />
      {isLoading ? (
        <div className="loading-container">
          <p>{rolesMessages.loading}</p>
        </div>
      ) : (
        <>
          <FormSection title={rolesMessages.title} hideHeader dense>
            <div className="fs-row-span-2 fs-table-container">
              <EntityTable
                columns={columns}
                data={currentTableData}
                keyField="role_id"
                actionColumnWidth="120px"
                autoFit={true}
                renderActions={(role) => (
                  <>
                    <Button variant="link" onClick={() => handleOpenEdit(role)}>
                      {rolesMessages.update}
                    </Button>
                    <Button
                      variant="link"
                      tone="danger"
                      isLoading={deletingId === role.role_id}
                      disabled={deletingId != null}
                      onClick={() => {
                        setDeletingId(role.role_id);
                        deleteMutation.mutate(role.role_id);
                      }}
                    >
                      {rolesMessages.delete}
                    </Button>
                  </>
                )}
              />
            </div>
          </FormSection>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}
      {isModalOpen && (
        <div className="segu-roles__modal">
          <div className="segu-roles__modal-content">
            <RoleForm
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              initialValues={editingRole || undefined}
              onSubmit={(values) => {
                if (editingRole) {
                  updateMutation.mutate({ id: editingRole.role_id, payload: values });
                } else {
                  createMutation.mutate(values);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;
