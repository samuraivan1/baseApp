import React, { useMemo, useState } from 'react';
import PageHeader from '@/shared/components/common/PageHeader';
import CommandBar from '@/shared/components/common/CommandBar';
import { EntityTableColumn } from '@/shared/components/common/Entitytable';
import PaginatedEntityTable from '@/shared/components/common/PaginatedEntityTable';
// import Pagination from '@/shared/components/common/Pagination';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';
import PermissionGate from '@/shared/components/common/PermissionGate';
import { ActionPermissions as AP } from '@/features/security/constants/permissions';
// import Button from '@/shared/components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import logger from '@/shared/api/logger';
import { getPermissions, deletePermission, createPermission, updatePermission } from '@/features/security/api/permissionService';
import { permisosMessages } from './Permisos.messages';
import { commonDefaultMessages } from '@/i18n/commonMessages';
import './Permisos.scss';
import type { Permission } from '@/shared/types/security';
import PermissionForm, { PermissionFormValues } from './PermissionForm';
import type { FilterableColumn } from '@/shared/components/common/CommandBar/types';
import TableActionsCell from '@/shared/components/common/TableActionsCell';
import ListLoading from '@/shared/components/common/ListLoading';

const PermisosPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Data
  const { data: permisos = [], isLoading } = useQuery({ queryKey: ['permisos'], queryFn: getPermissions });

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
    onSettled: () => {
      setDeletingId(null);
      setConfirmOpen(false);
    },
  });

  const createMut = useMutation({
    mutationFn: (input: Omit<Permission, 'permission_id'>) => createPermission(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permisos'] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<Omit<Permission, 'permission_id'>> }) => updatePermission(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permisos'] }),
  });

  // Columns
  const columns: EntityTableColumn<Permission>[] = useMemo(() => [
    { key: 'permission_string', label: permisosMessages.table.key, sortable: true },
    { key: 'resource', label: permisosMessages.table.resource, sortable: true },
    { key: 'action', label: permisosMessages.table.action, sortable: true },
    { key: 'scope', label: permisosMessages.table.scope, sortable: true },
    { key: 'description', label: permisosMessages.table.description },
  ], []);

  const filterableColumns: FilterableColumn[] = useMemo(() => [
    { key: 'permission_string', label: permisosMessages.table.key },
    { key: 'resource', label: permisosMessages.table.resource },
    { key: 'action', label: permisosMessages.table.action },
    { key: 'scope', label: permisosMessages.table.scope },
  ], []);
  const allowedFilterKeys = useMemo(() => filterableColumns.map(c => c.key) as Array<keyof Permission>, [filterableColumns]);

  // Filter + search + dedupe
  const filteredData = useMemo(() => {
    let data = permisos;
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
  }, [permisos, searchTerm, activeFilters, allowedFilterKeys]);

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
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'permisos.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="segu-permisos">
      <PageHeader title={permisosMessages.title} titleSize="1.75rem" />
      {!isFormOpen && (
      <PermissionGate perm={AP.PERMISSION_CREATE}>
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
        searchPlaceholder={permisosMessages.searchPlaceholder}
        searchLabel={permisosMessages.searchLabel}
        addLabel={permisosMessages.createButton}
        refreshLabel={commonDefaultMessages.refresh}
        filtersLabel={commonDefaultMessages.filters}
        excelLabel={commonDefaultMessages.exportCsv}
      />
      </PermissionGate>)}

      <ListLoading
        loading={isLoading}
        message={permisosMessages.loading}
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
                <PermissionGate perm={AP.PERMISSION_EDIT}>
                  <TableActionsCell onEdit={() => handleOpenEdit(p)} editLabel={commonDefaultMessages.edit} />
                </PermissionGate>
                <PermissionGate perm={AP.PERMISSION_DELETE}>
                  <TableActionsCell onDelete={() => { setDeletingId(p.permission_id); setConfirmOpen(true); }} deleteLabel={commonDefaultMessages.delete} />
                </PermissionGate>
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
          <PermissionGate perm={editing ? AP.PERMISSION_EDIT : AP.PERMISSION_CREATE}>
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
          </PermissionGate>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={permisosMessages.deleteTitle}
        message={permisosMessages.deleteMessage}
        confirmLabel={commonDefaultMessages.delete}
        cancelLabel={commonDefaultMessages.cancel}
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { if (deletingId != null) delMutation.mutate(deletingId); }}
      />
    </div>
  );
};

export default PermisosPage;
