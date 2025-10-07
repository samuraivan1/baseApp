import React, { useMemo, useState } from 'react';
import PageHeader from '@/shared/components/common/PageHeader';
import CommandBar from '@/shared/components/common/CommandBar';
import { EntityTableColumn } from '@/shared/components/common/Entitytable';
import PaginatedEntityTable from '@/shared/components/common/PaginatedEntityTable';
// import Pagination from '@/shared/components/common/Pagination';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';
import { ActionPermissions as AP } from '@/features/security/constants/permissions';
// import Button from '@/shared/components/ui/Button';
import { useQueryClient } from '@tanstack/react-query';
import { usePermissionsQuery, useCreatePermission, useUpdatePermission, useDeletePermission } from '@/features/security';
// Servicios y toasts gestionados por hooks centralizados en api/queries
import { permissionsMessages } from './Permissions.messages';
import { commonDefaultMessages } from '@/i18n/commonMessages';
// estilos de página centralizados en features/security/styles/index.scss
import type { Permission } from '@/shared/types/security';
import PermissionForm, { PermissionFormValues } from './PermissionForm';
import type { FilterableColumn } from '@/shared/components/common/CommandBar/types';
import TableActionsCell from '@/shared/components/common/TableActionsCell';
import ListLoading from '@/shared/components/common/ListLoading';

const PermissionsPage: React.FC = () => {
  const _qc = useQueryClient();

  // Data
  const { data: permissions = [], isLoading } = usePermissionsQuery();

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Permission | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Mutations
  const delMutation = useDeletePermission();

  const createMut = useCreatePermission();
  const updateMut = useUpdatePermission();

  // Columns
  const columns: EntityTableColumn<Permission>[] = useMemo(() => [
    { key: 'permission_string', label: permissionsMessages.table.key, sortable: true },
    { key: 'resource', label: permissionsMessages.table.resource, sortable: true },
    { key: 'action', label: permissionsMessages.table.action, sortable: true },
    { key: 'scope', label: permissionsMessages.table.scope, sortable: true },
    { key: 'description', label: permissionsMessages.table.description },
  ], []);

  const filterableColumns: FilterableColumn[] = useMemo(() => [
    { key: 'permission_string', label: permissionsMessages.table.key },
    { key: 'resource', label: permissionsMessages.table.resource },
    { key: 'action', label: permissionsMessages.table.action },
    { key: 'scope', label: permissionsMessages.table.scope },
  ], []);
  const allowedFilterKeys = useMemo(() => filterableColumns.map(c => c.key) as Array<keyof Permission>, [filterableColumns]);

  // Filter + search + dedupe
  const filteredData = useMemo(() => {
    let data = permissions;
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      data = data.filter(p => (
        p.permission_string.toLowerCase().includes(q) ||
        (p.action ?? '').toLowerCase().includes(q) ||
        (p.resource ?? '').toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
      ));
    }
    Object.entries(activeFilters).forEach(([k, v]) => {
      if (!v) return;
      const vv = v.toLowerCase();
      if (!allowedFilterKeys.includes(k as keyof Permission)) return;
      data = data.filter((row) => String(row[k as keyof Permission] ?? '').toLowerCase().includes(vv));
    });
    const map = new Map<number, Permission>();
    for (const r of data) map.set(r.permission_id, r);
    return Array.from(map.values());
  }, [permissions, searchTerm, activeFilters, allowedFilterKeys]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const currentTableData = useMemo(() => filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage), [filteredData, currentPage, rowsPerPage]);

  React.useEffect(() => { setCurrentPage(1); }, [searchTerm, activeFilters]);

  // Handlers
  const handleRowsPerPageChange = (n: number) => { setRowsPerPage(n); setCurrentPage(1); };
  const handleToggleFilters = () => setShowFilters(v => { const next = !v; if (!next) setActiveFilters({}); return next; });
  const handleOpenAdd = () => { setEditing(null); setIsFormOpen(true); };
  const handleOpenEdit = (p: Permission) => { setEditing(p); setIsFormOpen(true); };
  const handleExportCSV = () => {
    const rows = filteredData.map(p => [p.permission_id, p.permission_string, p.resource ?? '', p.action ?? '', p.scope ?? '', p.description ?? '']);
    const csv = 'permission_id,permission_string,resource,action,scope,description\n' + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'permissions.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="segu-permisos">
      <PageHeader title={permissionsMessages.title} titleSize="1.75rem" />
      {!isFormOpen && (
      <CommandBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={() => setCurrentPage(1)}
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
        filterableColumns={filterableColumns}
        onFilterChange={setActiveFilters}
        onAdd={handleOpenAdd}
        onRefresh={() => window.location.reload()}
        onExportExcel={handleExportCSV}
        searchPlaceholder={permissionsMessages.searchPlaceholder}
        searchLabel={permissionsMessages.searchLabel}
        addLabel={permissionsMessages.createButton}
        refreshLabel={commonDefaultMessages.refresh}
        filtersLabel={commonDefaultMessages.filters}
        excelLabel={commonDefaultMessages.exportCsv}
      />
      )}

      <ListLoading
        loading={isLoading}
        message={permissionsMessages.loading}
        showSpinner
        spinnerSize="lg"
        layout="centered"
        containerClassName="loading-container loading-container--fullscreen"
      >
        {!isFormOpen && (
        <div className="fs-row-span-2 fs-table-container">
          <PaginatedEntityTable
            columns={columns}
            data={currentTableData}
            keyField="permission_id"
            autoFit
            centered
            renderActions={(p: Permission) => (
              <>
                <TableActionsCell onEdit={() => handleOpenEdit(p)} editLabel={commonDefaultMessages.edit} />
                <TableActionsCell onDelete={() => { setDeletingId(p.permission_id); setConfirmOpen(true); }} deleteLabel={commonDefaultMessages.delete} />
              </>
            )}
            pagination={{
              page: currentPage,
              totalPages,
              onChange: setCurrentPage,
              rowsPerPage,
              onRowsPerPageChange: handleRowsPerPageChange,
            }}
          />
        </div>
        )}
      </ListLoading>

      {isFormOpen && (
        <div className="segu-permisos__embedded-form">
            <PermissionForm
              open={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              initialValues={editing ? {
                permission_string: editing.permission_string,
                resource: editing.resource ?? '',
                action: editing.action ?? '',
                scope: editing.scope ?? '',
                description: editing.description ?? '',
              } : undefined}
              onSubmit={(values: PermissionFormValues) => {
                const dto: Omit<Permission, 'permission_id'> = {
                  permission_string: String(values.permission_string || ''),
                  resource: values.resource ?? null,
                  action: values.action ?? null,
                  scope: values.scope ?? null,
                  description: values.description ?? null,
                };
                if (editing) {
                  updateMut.mutate({ id: editing.permission_id, input: dto });
                } else {
                  createMut.mutate(dto);
                }
                setIsFormOpen(false);
              }}
            />
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={permissionsMessages.deleteTitle}
        message={permissionsMessages.deleteMessage}
        confirmLabel={commonDefaultMessages.delete}
        cancelLabel={commonDefaultMessages.cancel}
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { if (deletingId != null) delMutation.mutate(deletingId, { onSettled: () => { setDeletingId(null); setConfirmOpen(false); } }); }}
      />
    </div>
  );
};

export default PermissionsPage;
