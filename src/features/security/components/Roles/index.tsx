import React, { useMemo, useState } from 'react';
import PageHeader from '@/shared/components/common/PageHeader';
import CommandBar from '@/shared/components/common/CommandBar';
import PermissionGate from '@/shared/components/PermissionGate';
import {
  EntityTableColumn,
} from '@/shared/components/common/Entitytable';
import PaginatedEntityTable from '@/shared/components/common/PaginatedEntityTable';
import TableActionsCell from '@/shared/components/common/TableActionsCell';
import ListLoading from '@/shared/components/common/ListLoading';

import { useRolesCrud } from '@/features/security';
import { Role } from '@/shared/types/security';
import rolesMessages from './Roles.messages';
import RoleForm from './RoleForm';
import type { FilterableColumn } from '@/shared/components/common/CommandBar/types';

import './Roles.scss';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import { useAuthStore } from '@/features/shell/state/authStore';

const RolesPage: React.FC = () => {
  const { list, create, update, remove } = useRolesCrud();
  const { data: roles = [], isLoading } = list;

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formReadOnly, setFormReadOnly] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns: EntityTableColumn<Role>[] = useMemo(
    () => [
      { key: 'name', label: rolesMessages.table.role, sortable: true },
      { key: 'description', label: rolesMessages.table.description, sortable: true },
    ],
    []
  );

  const filterableColumns: FilterableColumn[] = useMemo(
    () => [
      { key: 'name', label: rolesMessages.table.role },
      { key: 'description', label: rolesMessages.table.description },
    ],
    []
  );
  const allowedFilterKeys = useMemo(() => filterableColumns.map(c => c.key) as Array<keyof Role>, [filterableColumns]);

  const filteredData = useMemo(() => {
    let data: Role[] = Array.isArray(roles) ? roles : [];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (r: Role) =>
          r.name.toLowerCase().includes(q) ||
          (r.description ?? '').toLowerCase().includes(q)
      );
    }
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value) return;
      if (!allowedFilterKeys.includes(key as keyof Role)) return;
      const vq = value.toLowerCase();
      data = data.filter((row: Role) => String(row[key as keyof Role] ?? '').toLowerCase().includes(vq));
    });
    const map = new Map<number, Role>();
    for (const r of data) map.set(r.role_id, r);
    return Array.from(map.values());
  }, [roles, searchTerm, activeFilters, allowedFilterKeys]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const currentTableData = useMemo(
    () =>
      filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      ),
    [filteredData, currentPage, rowsPerPage]
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  React.useEffect(() => {
    const handler = () => {
      if (formReadOnly && useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_ROLES_UPDATE)) {
        setFormReadOnly(false);
      }
    };
    document.addEventListener('roleform:request-edit', handler as EventListener);
    return () => document.removeEventListener('roleform:request-edit', handler as EventListener);
  }, [formReadOnly]);

  const handleSearch = () => setCurrentPage(1);
  const handleToggleFilters = () =>
    setShowFilters((prev) => {
      const next = !prev;
      if (!next) {
        setActiveFilters({});
        setCurrentPage(1);
      }
      return next;
    });
  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };
  const handleOpenAdd = () => { setEditingRole(null); setIsFormOpen(true); setFormReadOnly(false); };
  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setIsFormOpen(true);
    setFormReadOnly(false);
  };
  const handleOpenView = (role: Role) => { setEditingRole(role); setIsFormOpen(true); setFormReadOnly(true); };
  const handleExportExcel = () => {
    const rows = filteredData.map((r) => [
      r.role_id,
      r.name,
      r.description ?? '',
    ]);
    const csv =
      'role_id,name,description\n' +
      rows
        .map((a) =>
          a.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')
        )
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'roles.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="segu-roles">
      <PageHeader title={rolesMessages.title} titleSize="1.75rem" />

      {!isFormOpen && (
        <PermissionGate perm={PERMISSIONS.SECURITY_ROLES_VIEW}>
          <PermissionGate
            perm={PERMISSIONS.SECURITY_ROLES_CREATE}
            fallback={(
              <CommandBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
                showFilters={showFilters}
                onToggleFilters={handleToggleFilters}
                filterableColumns={filterableColumns}
                onFilterChange={setActiveFilters}
                onRefresh={() => window.location.reload()}
                onExportExcel={handleExportExcel}
                searchPlaceholder={rolesMessages.searchPlaceholder}
                searchLabel={rolesMessages.searchLabel}
                refreshLabel={rolesMessages.refreshLabel}
                filtersLabel={rolesMessages.filtersLabel}
                excelLabel={rolesMessages.excelLabel}
              />
            )}
          >
            <CommandBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
              showFilters={showFilters}
              onToggleFilters={handleToggleFilters}
              filterableColumns={filterableColumns}
              onFilterChange={setActiveFilters}
              onAdd={handleOpenAdd}
              onRefresh={() => window.location.reload()}
              onExportExcel={handleExportExcel}
              searchPlaceholder={rolesMessages.searchPlaceholder}
              searchLabel={rolesMessages.searchLabel}
              addLabel={rolesMessages.addLabel}
              refreshLabel={rolesMessages.refreshLabel}
              filtersLabel={rolesMessages.filtersLabel}
              excelLabel={rolesMessages.excelLabel}
            />
          </PermissionGate>
        </PermissionGate>
      )}

      <ListLoading
        loading={isLoading}
        message={rolesMessages.loading}
        showSpinner
        spinnerSize="lg"
        layout="centered"
        containerClassName="loading-container loading-container--fullscreen"
      >
        {!isFormOpen && (
          <div className="fs-row-span-2 fs-table-container">
            {(() => {
              const canEdit = useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_ROLES_UPDATE);
              const canDelete = useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_ROLES_DELETE);
              const showActions = canEdit || canDelete;
              return (
                <PaginatedEntityTable<Role>
                  columns={columns}
                  data={currentTableData}
                  keyField="role_id"
                  autoFit
                  centered
                  onRowDoubleClick={(row) => {
                    const canUpdate = useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_ROLES_UPDATE);
                    if (canUpdate) handleOpenEdit(row); else handleOpenView(row);
                  }}
                  {...(showActions
                    ? {
                        renderActions: (role: Role) => (
                          <>
                            {canEdit && (
                              <TableActionsCell onEdit={() => handleOpenEdit(role)} editLabel={rolesMessages.update} />
                            )}
                            {canDelete && (
                              <TableActionsCell onDelete={() => { setDeletingId(role.role_id); }} deleteLabel={rolesMessages.delete} />
                            )}
                          </>
                        ),
                      }
                    : {})}
                  pagination={{
                    page: currentPage,
                    totalPages,
                    onChange: setCurrentPage,
                    rowsPerPage,
                    onRowsPerPageChange: handleRowsPerPageChange,
                  }}
                />
              );
            })()}
          </div>
        )}
      </ListLoading>

      {isFormOpen && (
        <div className="segu-roles__embedded-form">
          <RoleForm
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            initialValues={editingRole || undefined}
            readOnly={formReadOnly}
            hasEditPermission={useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_ROLES_UPDATE)}
            onSubmit={(values) => {
              if (formReadOnly) {
                if (useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_ROLES_UPDATE)) {
                  setFormReadOnly(false);
                }
                return;
              }
              const canCreate = useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_ROLES_CREATE);
              const canUpdate = useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_ROLES_UPDATE);
              const dto = {
                name: String(values.name || ''),
                description: values.description ?? null,
              };
              if (editingRole) {
                if (!canUpdate) return;
                update.mutate({ id: editingRole.role_id, input: dto });
              } else {
                if (!canCreate) return;
                create.mutate(dto);
              }
              setIsFormOpen(false);
            }}
          />
        </div>
      )}
      <ConfirmDialog
        open={deletingId != null}
        title={rolesMessages.deleteTitle ?? 'Eliminar rol'}
        message={rolesMessages.deleteMessage ?? '¿Deseas eliminar este rol? Esta acción no se puede deshacer.'}
        confirmLabel={rolesMessages.delete}
        cancelLabel={rolesMessages.cancelLabel ?? 'Cancelar'}
        danger
        onCancel={() => setDeletingId(null)}
        onConfirm={() => { if (deletingId != null) remove.mutate(deletingId, { onSettled: () => setDeletingId(null) }); }}
      />
    </div>
  );
};

export default RolesPage;
