import React, { useMemo, useState } from 'react';
import PageHeader from '@/shared/components/common/PageHeader';
import CommandBar from '@/shared/components/common/CommandBar';
import PermissionGate from '@/shared/components/PermissionGate';
import PaginatedEntityTable from '@/shared/components/common/PaginatedEntityTable';
import type { EntityTableColumn } from '@/shared/components/common/Entitytable';
import type { FilterableColumn } from '@/shared/components/common/CommandBar/types';
import { permissionsMessages } from './Permissions.messages';
import { commonDefaultMessages } from '@/i18n/commonMessages';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import type { Permission } from '@/features/security/types';
import { usePermissionsCrud } from '@/features/security';
import { showToast } from '@/shared/utils/showToast';
import type { PermissionFormValues } from './permission.schema';
import { exportCsv } from '@/shared/utils/exportCsv';
import type { PermissionDTO } from '@/features/security/api/permissions.dto';
import ListLoading from '@/shared/components/common/ListLoading';
import PermissionForm from '../Permissions/PermissionForm';
import { useAuthStore } from '@/features/shell/state/authStore';
import TableActionsCell from '@/shared/components/common/TableActionsCell';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';

// Permisos — vista solo lectura con búsqueda, filtros y export CSV
const PermissionsPage: React.FC = () => {
  const { list, update, create, remove } = usePermissionsCrud();
  const { data: permissions = [], isLoading } = list as {
    data: Permission[];
    isLoading: boolean;
  };
  const updateMut = update;
  const createMut = create;
  const deleteMut = remove;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [justUpdatedId, setJustUpdatedId] = useState<number | null>(null);

  // Estado UI
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Permission | null>(null);
  const [formReadOnly, setFormReadOnly] = useState(true);

  const columns: EntityTableColumn<Permission>[] = useMemo(
    () => [
      {
        key: 'permission_string',
        label: permissionsMessages.table.key,
        sortable: true,
      },
      {
        key: 'resource',
        label: permissionsMessages.table.resource,
        sortable: true,
      },
      {
        key: 'action',
        label: permissionsMessages.table.action,
        sortable: true,
      },
      { key: 'scope', label: permissionsMessages.table.scope, sortable: true },
      { key: 'description', label: permissionsMessages.table.description },
    ],
    []
  );

  const filterableColumns: FilterableColumn[] = useMemo(
    () => [
      { key: 'permission_string', label: permissionsMessages.table.key },
      { key: 'resource', label: permissionsMessages.table.resource },
      { key: 'action', label: permissionsMessages.table.action },
      { key: 'scope', label: permissionsMessages.table.scope },
    ],
    []
  );
  const allowedFilterKeys = useMemo(
    () => filterableColumns.map((c) => c.key) as Array<keyof Permission>,
    [filterableColumns]
  );

  const filteredData = useMemo(() => {
    let data: Permission[] = [...permissions];
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (p) =>
          p.permission_string.toLowerCase().includes(q) ||
          (p.action ?? '').toLowerCase().includes(q) ||
          (p.resource ?? '').toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q)
      );
    }
    Object.entries(activeFilters).forEach(([k, v]) => {
      if (!v) return;
      const vv = v.toLowerCase();
      if (!allowedFilterKeys.includes(k as keyof Permission)) return;
      data = data.filter((row) =>
        String(row[k as keyof Permission] ?? '')
          .toLowerCase()
          .includes(vv)
      );
    });
    // Dedupe por id
    const map = new Map<number, Permission>();
    for (const r of data) map.set(r.permission_id, r);
    return Array.from(map.values());
  }, [permissions, searchTerm, activeFilters, allowedFilterKeys]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const currentTableData = useMemo(
    () =>
      filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      ),
    [filteredData, currentPage, rowsPerPage]
  );

  // Efecto para desplazar y resaltar fila actualizada
  React.useEffect(() => {
    if (justUpdatedId == null) return;
    const el = document.querySelector(
      `[data-row-id="${justUpdatedId}"]`
    ) as HTMLElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('row-flash');
    const t = setTimeout(() => {
      el.classList.remove('row-flash');
      setJustUpdatedId(null);
    }, 2200);
    return () => clearTimeout(t);
  }, [justUpdatedId]);

  // Reset página al cambiar filtros/búsqueda
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  const handleRowsPerPageChange = (n: number) => {
    setRowsPerPage(n);
    setCurrentPage(1);
  };
  const handleToggleFilters = () =>
    setShowFilters((v) => {
      const next = !v;
      if (!next) setActiveFilters({});
      return next;
    });

  const handleExportCSV = React.useCallback(() => {
    const rows = filteredData.map((p) => [
      p.permission_string,
      p.resource ?? '',
      p.action ?? '',
      p.scope ?? '',
      p.description ?? '',
    ]);
    exportCsv(
      permissionsMessages.csv.filename,
      permissionsMessages.csv.headers,
      rows
    );
  }, [filteredData]);

  // Escuchar solicitud de edición desde el formulario embebido
  React.useEffect(() => {
    const handler = () => {
      const canEdit = useAuthStore
        .getState()
        .hasPermission(PERMISSIONS.SECURITY_PERMISSIONS_UPDATE);
      if (isFormOpen && formReadOnly && canEdit) {
        setFormReadOnly(false);
      }
    };
    document.addEventListener(
      'permissionform:request-edit',
      handler as EventListener
    );
    return () =>
      document.removeEventListener(
        'permissionform:request-edit',
        handler as EventListener
      );
  }, [isFormOpen, formReadOnly]);

  return (
    <div className="segu-permisos">
      <PageHeader title={permissionsMessages.title} titleSize="1.75rem" />

      {!isFormOpen && (
        <PermissionGate perm={PERMISSIONS.SECURITY_PERMISSIONS_VIEW}>
          <CommandBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={() => setCurrentPage(1)}
            showFilters={showFilters}
            onToggleFilters={handleToggleFilters}
            filterableColumns={filterableColumns}
            onFilterChange={setActiveFilters}
            onAdd={
              useAuthStore
                .getState()
                .hasPermission(PERMISSIONS.SECURITY_PERMISSIONS_CREATE)
                ? () => {
                    setEditing(null);
                    setIsFormOpen(true);
                    setFormReadOnly(false);
                  }
                : undefined
            }
            onRefresh={() => window.location.reload()}
            onExportExcel={handleExportCSV}
            searchPlaceholder={permissionsMessages.searchPlaceholder}
            searchLabel={permissionsMessages.searchLabel}
            addLabel={
              useAuthStore
                .getState()
                .hasPermission(PERMISSIONS.SECURITY_PERMISSIONS_CREATE)
                ? permissionsMessages.createButton
                : undefined
            }
            refreshLabel={commonDefaultMessages.refresh}
            filtersLabel={commonDefaultMessages.filters}
            excelLabel={commonDefaultMessages.exportCsv}
          />

          <ListLoading
            loading={isLoading}
            message={permissionsMessages.loading}
            showSpinner
            spinnerSize="lg"
            layout="centered"
            containerClassName="loading-container loading-container--fullscreen"
          >
            <div className="fs-row-span-2 fs-table-container">
              <PaginatedEntityTable
                columns={columns}
                data={currentTableData}
                keyField="permission_id"
                autoFit
                centered
                onRowDoubleClick={(row) => {
                  setEditing(row);
                  setIsFormOpen(true);
                  setFormReadOnly(true);
                }}
                // rowProps no soportado por PaginatedEntityTable; data-row-id se aplicará
                // mediante atributo en la celda de acciones o key prop si el componente lo permite.
                renderActions={(() => {
                  const canEdit = useAuthStore
                    .getState()
                    .hasPermission(PERMISSIONS.SECURITY_PERMISSIONS_UPDATE);
                  const canDelete = useAuthStore
                    .getState()
                    .hasPermission(PERMISSIONS.SECURITY_PERMISSIONS_DELETE);
                  const show = canEdit || canDelete;
                  if (!show) return undefined;
                  const ActionsRenderer: React.FC<Permission> = (
                    row: Permission
                  ) => (
                    <>
                      {canEdit && (
                        <TableActionsCell
                          onEdit={() => {
                            setEditing(row);
                            setIsFormOpen(true);
                            setFormReadOnly(false);
                          }}
                          editLabel={commonDefaultMessages.edit}
                        />
                      )}
                      {canDelete && (
                        <TableActionsCell
                          onDelete={() => {
                            setDeletingId(row.permission_id);
                            setConfirmOpen(true);
                          }}
                          deleteLabel={commonDefaultMessages.delete}
                        />
                      )}
                    </>
                  );
                  ActionsRenderer.displayName = 'PermissionsActionsRenderer';
                  return ActionsRenderer as unknown as (
                    row: Permission
                  ) => React.ReactNode;
                })()}
                pagination={{
                  page: currentPage,
                  totalPages,
                  onChange: setCurrentPage,
                  rowsPerPage,
                  onRowsPerPageChange: handleRowsPerPageChange,
                }}
              />
            </div>
          </ListLoading>
        </PermissionGate>
      )}
      {isFormOpen && (
        <PermissionForm
          open={isFormOpen}
          readOnly={formReadOnly}
          hasEditPermission={useAuthStore
            .getState()
            .hasPermission(PERMISSIONS.SECURITY_PERMISSIONS_UPDATE)}
          initialValues={
            editing
              ? {
                  permission_string: editing.permission_string,
                  resource: editing.resource ?? '',
                  action: editing.action ?? '',
                  scope: editing.scope ?? '',
                  description: editing.description ?? '',
                }
              : undefined
          }
          onClose={() => {
            setIsFormOpen(false);
            setEditing(null);
            setFormReadOnly(true);
          }}
          onSubmit={async (values: PermissionFormValues) => {
            const dtoTyped: PermissionDTO = {
              permission_string: String(values.permission_string || ''),
              resource: values.resource ? values.resource : null,
              action: values.action ? values.action : null,
              scope: values.scope ? values.scope : null,
              description: values.description ? values.description : null,
            };
            const { apiCall } = await import('@/shared/api/apiCall');
            if (editing) {
              const canUpdate = useAuthStore
                .getState()
                .hasPermission(PERMISSIONS.SECURITY_PERMISSIONS_UPDATE);
              if (!canUpdate) return;
              const res = await apiCall(
                () =>
                  updateMut.mutateAsync({
                    id: editing.permission_id,
                    input: dtoTyped,
                  }),
                { where: 'security.permissions.update', toastOnError: true }
              );
              if (res.ok) {
                showToast.success(permissionsMessages.updateSuccess);
                setIsFormOpen(false);
                setEditing(null);
                setJustUpdatedId(editing.permission_id);
                setFormReadOnly(true);
              }
            } else {
              const canCreate = useAuthStore
                .getState()
                .hasPermission(PERMISSIONS.SECURITY_PERMISSIONS_CREATE);
              if (!canCreate) return;
              const res = await apiCall(() => createMut.mutateAsync(dtoTyped), {
                where: 'security.permissions.create',
                toastOnError: true,
              });
              if (res.ok) {
                showToast.success(permissionsMessages.createSuccess);
                setIsFormOpen(false);
                setFormReadOnly(true);
                const created = res.value as Permission | undefined;
                if (created && created.permission_id)
                  setJustUpdatedId(created.permission_id);
              }
            }
          }}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={permissionsMessages.deleteTitle}
        message={permissionsMessages.deleteMessage}
        confirmLabel={commonDefaultMessages.delete}
        cancelLabel={commonDefaultMessages.cancel}
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          if (deletingId == null) return;
          const { apiCall } = await import('@/shared/api/apiCall');
          const res = await apiCall(() => deleteMut.mutateAsync(deletingId), {
            where: 'security.permissions.delete',
            toastOnError: true,
          });
          if (res.ok) {
            setDeletingId(null);
            setConfirmOpen(false);
          }
          return res;
        }}
      />

      {/* Efecto de realce de fila movido al nivel de componente */}
    </div>
  );
};

PermissionsPage.displayName = 'PermissionsPage';
export default PermissionsPage;
