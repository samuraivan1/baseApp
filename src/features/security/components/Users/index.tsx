import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUsersCrud, useUserRolesCrud, usersKeys, toCreateUserDto, toUpdateUserDto, addUserRole } from '@/features/security';
import PageHeader from '@/shared/components/common/PageHeader';
import CommandBar from '@/shared/components/common/CommandBar';
import PermissionGate from '@/shared/components/common/PermissionGate';
import { EntityTableColumn } from '@/shared/components/common/Entitytable';
import PaginatedEntityTable from '@/shared/components/common/PaginatedEntityTable';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';
import UserForm from './UserForm';
import { usersMessages } from './Users.messages';
import { commonDefaultMessages } from '@/i18n/commonMessages';
import type { User } from '@/shared/types/security';
import type { FilterableColumn } from '@/shared/components/common/CommandBar/types';
import TableActionsCell from '@/shared/components/common/TableActionsCell';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import ListLoading from '@/shared/components/common/ListLoading';
import { useAuthStore } from '@/features/shell/state/authStore';

type UserView = {
  idUsuario: number;
  nombre: string;
  segundoNombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  correoElectronico: string;
  nombreUsuario: string;
  status: 'activo' | 'inactivo';
  rolId?: number;
};

const UsuariosPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<UserView | null>(null);
  const [formReadOnly, setFormReadOnly] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { list, create, update, remove } = useUsersCrud();
  const {
    data: usersRaw = [],
    isLoading: isLoadingUsers,
    isError,
    error,
  } = list;
  const { list: userRolesList } = useUserRolesCrud();
  const { data: userRoles = [], isLoading: isLoadingRoles } = userRolesList;

  const usuarios: UserView[] = React.useMemo(() => {
    const roleByUser = new Map(
      (Array.isArray(userRoles) ? userRoles : []).map((ur) => [
        ur.user_id,
        ur.role_id,
      ])
    );
    const base = Array.isArray(usersRaw)
      ? (usersRaw as Array<User | Record<string, any>>)
      : [];
    return base.map((u) => ({
      idUsuario: Number((u as any).user_id ?? (u as any).id),
      nombre: (u as any).first_name,
      segundoNombre: (u as any).second_name ?? undefined,
      apellidoPaterno: (u as any).last_name_p,
      apellidoMaterno: (u as any).last_name_m ?? undefined,
      correoElectronico: (u as any).email,
      nombreUsuario: (u as any).username,
      status:
        (u as any).is_active === 1 || (u as any).is_active === true
          ? 'activo'
          : 'inactivo',
      rolId: roleByUser.get((u as any).user_id ?? (u as any).id) ?? undefined,
    }));
  }, [usersRaw, userRoles]);

  const isLoading = isLoadingUsers || isLoadingRoles;

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns: EntityTableColumn<UserView>[] = useMemo(
    () => [
      { key: 'idUsuario', label: usersMessages.id, sortable: true },
      { key: 'correoElectronico', label: usersMessages.email, sortable: true },
      { key: 'nombre', label: usersMessages.nombre, sortable: true },
      { key: 'segundoNombre', label: usersMessages.segundoNombre, sortable: false },
      { key: 'apellidoPaterno', label: usersMessages.form.apellidoPaterno, sortable: true },
      { key: 'apellidoMaterno', label: usersMessages.form.apellidoMaterno, sortable: true },
      { key: 'status', label: usersMessages.status, sortable: true },
    ],
    []
  );

  const filterableColumns: FilterableColumn[] = useMemo(
    () => [
      { key: 'idUsuario', label: usersMessages.id },
      { key: 'correoElectronico', label: usersMessages.email },
      { key: 'nombre', label: usersMessages.nombre },
      { key: 'segundoNombre', label: usersMessages.segundoNombre },
      { key: 'apellidoPaterno', label: usersMessages.form.apellidoPaterno },
      { key: 'apellidoMaterno', label: usersMessages.form.apellidoMaterno },
      { key: 'status', label: usersMessages.status },
    ],
    []
  );

  const allowedFilterKeys = useMemo(
    () => filterableColumns.map((c) => c.key) as Array<keyof UserView>,
    [filterableColumns]
  );

  const filteredData = useMemo(() => {
    let data: UserView[] = Array.isArray(usuarios) ? usuarios : [];
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (u) =>
          `${u.nombre} ${u.apellidoPaterno ?? ''} ${u.apellidoMaterno ?? ''}`
            .toLowerCase()
            .includes(q) ||
          u.nombreUsuario.toLowerCase().includes(q) ||
          u.correoElectronico.toLowerCase().includes(q)
      );
    }
    Object.entries(activeFilters).forEach(([k, v]) => {
      if (!v) return;
      const vv = String(v).toLowerCase();
      if (!allowedFilterKeys.includes(k as keyof UserView)) return;
      data = data.filter((row) =>
        String(row[k as keyof UserView] ?? '')
          .toLowerCase()
          .includes(vv)
      );
    });
    const map = new Map<number, UserView>();
    for (const r of Array.isArray(data) ? data : []) map.set(r.idUsuario, r);
    return Array.from(map.values());
  }, [usuarios, searchTerm, activeFilters, allowedFilterKeys]);

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
      if (formReadOnly && useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_USERS_UPDATE)) {
        setFormReadOnly(false);
      }
    };
    document.addEventListener('userform:request-edit', handler as any);
    return () => document.removeEventListener('userform:request-edit', handler as any);
  }, [formReadOnly]);

  const openCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
    setFormReadOnly(false);
  };
  const openEdit = (u: UserView) => {
    setEditing(u);
    setIsFormOpen(true);
    setFormReadOnly(false);
  };
  const openView = (u: UserView) => {
    setEditing(u);
    setIsFormOpen(true);
    setFormReadOnly(true);
  };
  const handleToggleFilters = () =>
    setShowFilters((v) => {
      const next = !v;
      if (!next) setActiveFilters({});
      return next;
    });
  const handleRowsPerPageChange = (n: number) => {
    setRowsPerPage(n);
    setCurrentPage(1);
  };
  const handleExportCSV = () => {
    const rows = filteredData.map((u) => [
      u.idUsuario,
      u.nombre,
      u.apellidoPaterno ?? '',
      u.apellidoMaterno ?? '',
      u.nombreUsuario,
      u.correoElectronico,
      u.rolId ?? '',
      u.status,
    ]);
    const csv =
      'idUsuario,nombre,apellidoPaterno,apellidoMaterno,nombreUsuario,correoElectronico,rolId,status\n' +
      rows
        .map((r) =>
          r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')
        )
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="segu-users">
      <PageHeader title={usersMessages.title} titleSize="1.75rem" />
      {!isFormOpen && (
        <PermissionGate perm={PERMISSIONS.SECURITY_USERS_VIEW}>
          <PermissionGate
            perm={PERMISSIONS.SECURITY_USERS_CREATE}
            fallback={(
              <CommandBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={() => setCurrentPage(1)}
                showFilters={showFilters}
                onToggleFilters={handleToggleFilters}
                filterableColumns={filterableColumns}
                onFilterChange={setActiveFilters}
                onRefresh={() => window.location.reload()}
                onExportExcel={handleExportCSV}
                searchPlaceholder={usersMessages.searchPlaceholder ?? 'Buscar por nombre, usuario o correo'}
                searchLabel={usersMessages.searchLabel ?? 'Buscar'}
                refreshLabel={commonDefaultMessages.refresh}
                filtersLabel={commonDefaultMessages.filters}
                excelLabel={commonDefaultMessages.exportCsv}
              />
            )}
          >
            <CommandBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={() => setCurrentPage(1)}
              showFilters={showFilters}
              onToggleFilters={handleToggleFilters}
              filterableColumns={filterableColumns}
              onFilterChange={setActiveFilters}
              onAdd={openCreate}
              onRefresh={() => window.location.reload()}
              onExportExcel={handleExportCSV}
              searchPlaceholder={usersMessages.searchPlaceholder ?? 'Buscar por nombre, usuario o correo'}
              searchLabel={usersMessages.searchLabel ?? 'Buscar'}
              addLabel={usersMessages.createButton}
              refreshLabel={commonDefaultMessages.refresh}
              filtersLabel={commonDefaultMessages.filters}
              excelLabel={commonDefaultMessages.exportCsv}
            />
          </PermissionGate>
        </PermissionGate>
      )}

      <ListLoading
        loading={isLoading}
        message={usersMessages.loading}
        showSpinner
        spinnerSize="lg"
        layout="centered"
        containerClassName="loading-container loading-container--fullscreen"
      >
        {isError && (
          <div className="segu-users__error" role="alert">
            {(error as Error)?.message ?? 'Ocurrió un error al cargar los usuarios.'}
          </div>
        )}
        {!isFormOpen && (
          <div className="fs-row-span-2 fs-table-container">
            {(() => {
              const canEdit = useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_USERS_UPDATE);
              const canDelete = useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_USERS_DELETE);
              const showActions = canEdit || canDelete;
              return (
                <PaginatedEntityTable
                  columns={columns}
                  data={currentTableData}
                  keyField="idUsuario"
                  autoFit
                  centered
                  onRowDoubleClick={(row) => {
                    const canUpdate = useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_USERS_UPDATE);
                    if (canUpdate) openEdit(row); else openView(row);
                  }}
                  {...(showActions
                    ? {
                        renderActions: (u: UserView) => (
                          <>
                            {canEdit && (
                              <TableActionsCell
                                onEdit={() => openEdit(u)}
                                editLabel={usersMessages.edit}
                              />
                            )}
                            {canDelete && (
                              <TableActionsCell
                                onDelete={() => {
                                  setDeletingId(u.idUsuario);
                                  setConfirmOpen(true);
                                }}
                                deleteLabel={usersMessages.delete}
                              />
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
        <div className="segu-users__embedded-form">
          <UserForm
            initialData={editing || undefined}
            readOnly={formReadOnly}
            hasEditPermission={useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_USERS_UPDATE)}
            onCancel={() => setIsFormOpen(false)}
            onSubmit={async (values) => {
              if (formReadOnly) {
                if (useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_USERS_UPDATE)) {
                  setFormReadOnly(false);
                }
                return;
              }
              const canCreate = useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_USERS_CREATE);
              const canUpdate = useAuthStore.getState().hasPermission(PERMISSIONS.SECURITY_USERS_UPDATE);
              if (!editing) {
                if (!canCreate) return;
                const dto = toCreateUserDto(values as any);
                const created = await create.mutateAsync(dto as any);
                if ((values as any).rolId != null) {
                  try {
                    await addUserRole(
                      (created as any).user_id,
                      Number((values as any).rolId)
                    );
                  } catch {}
                }
              } else {
                if (!canUpdate) return;
                const dto = toUpdateUserDto(values as any);
                await update.mutateAsync({
                  id: editing.idUsuario,
                  input: dto as any,
                });
              }
              setIsFormOpen(false);
              setEditing(null);
              queryClient.invalidateQueries({ queryKey: usersKeys.all });
            }}
          />
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={usersMessages.deleteUserTitle ?? 'Eliminar Usuario'}
        message={usersMessages.deleteUserMessage ?? '¿Deseas eliminar este usuario? Esta acción no se puede deshacer.'}
        confirmLabel={usersMessages.delete}
        cancelLabel={commonDefaultMessages.cancel}
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          if (deletingId != null) {
            try {
              await remove.mutateAsync(deletingId);
            } finally {
              setDeletingId(null);
              setConfirmOpen(false);
              queryClient.invalidateQueries({ queryKey: usersKeys.all });
            }
          }
        }}
      />
    </div>
  );
};

export default UsuariosPage;
import './Users.scss';
