import React, { useMemo, useState } from 'react';
import PageHeader from '@/shared/components/common/PageHeader';
import CommandBar from '@/shared/components/common/CommandBar';
import PermissionGate from '@/shared/components/common/PermissionGate';
import {
  EntityTableColumn,
} from '@/shared/components/common/Entitytable';
import PaginatedEntityTable from '@/shared/components/common/PaginatedEntityTable';
// import Button from '@/shared/components/ui/Button';
import TableActionsCell from '@/shared/components/common/TableActionsCell';
// import Pagination from '@/shared/components/common/Pagination';
import ListLoading from '@/shared/components/common/ListLoading';

import { useRolesCrud } from '@/features/security';
import { Role } from '@/shared/types/security';
import rolesMessages from './Roles.messages';
import { useEnsureAllPermsForUserRole } from '@/features/security';
import RoleForm from './RoleForm';
import type { FilterableColumn } from '@/shared/components/common/CommandBar/types';

import './Roles.scss';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';
import { ActionPermissions as AP } from '@/features/security/constants/permissions';
import { useAuthStore } from '@/features/shell/state/authStore';
import DetailDrawer, { DetailField } from '@/shared/components/common/DetailDrawer';

const RolesPage: React.FC = () => {
  // Data + Mutations via generic CRUD
  const { list, create, update, remove } = useRolesCrud();
  const { data: roles = [], isLoading } = list;
  useEnsureAllPermsForUserRole(['iamendezm'], [1]);

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewRow, setViewRow] = useState<Role | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Columnas visibles en tabla
  const columns: EntityTableColumn<Role>[] = useMemo(
    () => [
      { key: 'name', label: rolesMessages.table.role, sortable: true },
      { key: 'description', label: rolesMessages.table.description, sortable: true },
    ],
    []
  );

  // Columnas filtrables
  const filterableColumns: FilterableColumn[] = useMemo(
    () => [
      { key: 'name', label: 'Rol' },
      { key: 'description', label: 'Descripción' },
    ],
    []
  );
  const allowedFilterKeys = useMemo(() => filterableColumns.map(c => c.key) as Array<keyof Role>, [filterableColumns]);

  // Filtrado simple client-side
  const filteredData = useMemo(() => {
    // 1) Punto de partida
    let data = roles;

    // 2) Texto de búsqueda (en vivo)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description ?? '').toLowerCase().includes(q)
      );
    }

    // 3) Filtros dinámicos (AND)
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value) return;
      if (!allowedFilterKeys.includes(key as keyof Role)) return;
      const vq = value.toLowerCase();
      data = data.filter((row) => String(row[key as keyof Role] ?? '').toLowerCase().includes(vq));
    });

    // 4) Deduplicar por clave primaria para evitar repetidos del backend
    const map = new Map<number, Role>();
    for (const r of data) map.set(r.role_id, r);
    return Array.from(map.values());
  }, [roles, searchTerm, activeFilters, allowedFilterKeys]);

  // Paginación calculada
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const currentTableData = useMemo(
    () =>
      filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      ),
    [filteredData, currentPage, rowsPerPage]
  );

  // Volver a la página 1 cuando cambian los criterios de filtrado
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  // Handlers
  const handleSearch = () => setCurrentPage(1);
  const handleToggleFilters = () =>
    setShowFilters((prev) => {
      const next = !prev;
      if (!next) {
        // Al cerrar filtros, limpiar filtros activos
        setActiveFilters({});
        setCurrentPage(1);
      }
      return next;
    });
  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };
  const handleOpenAdd = () => { setEditingRole(null); setIsFormOpen(true); };
  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };
  const handleOpenView = (role: Role) => { setViewRow(role); setViewOpen(true); };
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
        <PermissionGate perm={AP.ROLE_CREATE}
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
          // búsqueda
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
          // filtros
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
          filterableColumns={filterableColumns}
          onFilterChange={setActiveFilters}
          // acciones
          onAdd={handleOpenAdd}
          onRefresh={() => window.location.reload()}
          onExportExcel={handleExportExcel}
          // labels
          searchPlaceholder={rolesMessages.searchPlaceholder}
          searchLabel={rolesMessages.searchLabel}
          addLabel={rolesMessages.addLabel}
          refreshLabel={rolesMessages.refreshLabel}
          filtersLabel={rolesMessages.filtersLabel}
          excelLabel={rolesMessages.excelLabel}
        />
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
              const canEdit = useAuthStore.getState().hasPermission(AP.ROLE_EDIT);
              const canDelete = useAuthStore.getState().hasPermission(AP.ROLE_DELETE);
              const showActions = canEdit || canDelete;
              return (
            <PaginatedEntityTable
              columns={columns}
              data={currentTableData}
              keyField="role_id"
              autoFit
              centered
              onRowDoubleClick={(row) => handleOpenEdit(row)}
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
            />);
            })()}

      {/* Detalle (modo lectura) */}
      <DetailDrawer<Role>
        title={rolesMessages.viewTitle ?? 'Detalle de rol'}
        open={viewOpen}
        data={viewRow}
        onClose={() => setViewOpen(false)}
        fields={[
          { key: 'role_id', label: rolesMessages.table.role ?? 'Rol', render: (r) => String(r.role_id) },
          { key: 'name', label: rolesMessages.table.role ?? 'Rol' },
          { key: 'description', label: rolesMessages.table.description ?? 'Descripción' },
        ] as ReadonlyArray<DetailField<Role>>}
      />
          </div>
        )}
      </ListLoading>

      {isFormOpen && (
        <div className="segu-roles__embedded-form">
          {/* PermissionGate removed around form submit */}
            <RoleForm
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            initialValues={editingRole || undefined}
            onSubmit={(values) => {
              const dto = {
                name: String(values.name || ''),
                description: values.description ?? null,
              };
              if (editingRole) {
                update.mutate({ id: editingRole.role_id, input: dto });
              } else {
                create.mutate(dto);
              }
              setIsFormOpen(false);
            }}
          />
          
        </div>
      )}
      {/* Confirmación de eliminación */}
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
