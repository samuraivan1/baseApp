import { useMemo, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useUsersCrud,
  useUserRolesCrud,
  usersKeys,
  toCreateUserDto,
  toUpdateUserDto,
  addUserRole,
} from '@/features/security';
type UserInput = Partial<User>;
import PageHeader from '@/shared/components/common/PageHeader';
import CommandBar from '@/shared/components/common/CommandBar';
import PermissionGate from '@/shared/components/PermissionGate';
import type { EntityTableColumn } from '@/shared/components/common/Entitytable';
import PaginatedEntityTable from '@/shared/components/common/PaginatedEntityTable';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';
import UserForm from './UserForm';
import { usersMessages } from './Users.messages';
import { commonDefaultMessages } from '@/i18n/commonMessages';
import type { IUser as User } from '@/features/security/types/models';
import type { IUserRole as UserRole } from '@/features/security/types/relations';
import type { FilterableColumn } from '@/shared/components/common/CommandBar/types';
import TableActionsCell from '@/shared/components/common/TableActionsCell';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import ListLoading from '@/shared/components/common/ListLoading';
import { useAuthStore } from '@/features/shell/state/authStore';

// Combinación del usuario con su rol para la vista
type UserWithRole = (User & { rolId?: number }) & Record<string, unknown>;

const UsuariosPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<UserWithRole | null>(null);
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

  const usuarios: UserWithRole[] = useMemo(() => {
    const roleByUserId = new Map<number, number>();
    if (Array.isArray(userRoles)) {
      userRoles.forEach((ur: UserRole) => {
        roleByUserId.set(ur.user_id, ur.role_id);
      });
    }

    if (!Array.isArray(usersRaw)) return [];

    return usersRaw.map((user: User) => {
      const u = user as unknown as Record<string, unknown>;
      const normalized: Record<string, unknown> = {
        ...u,
        // Flags garantizados como boolean
        is_active: Boolean((u.is_active as boolean | number | undefined) ?? (u.isActive as boolean | undefined)),
        mfa_enabled: Boolean((u.mfa_enabled as boolean | number | undefined) ?? (u.mfaEnabled as boolean | undefined)),
        // Identificador en snake_case
        user_id: (u.user_id as number | undefined) ?? (u.userId as number | undefined) ?? 0,
        // Nombres en snake_case
        first_name: (u.first_name as string | undefined) ?? (u.firstName as string | undefined) ?? '',
        second_name: (u.second_name as string | null | undefined) ?? (u.secondName as string | null | undefined) ?? null,
        last_name_p: (u.last_name_p as string | undefined) ?? (u.lastNameP as string | undefined) ?? '',
        last_name_m: (u.last_name_m as string | null | undefined) ?? (u.lastNameM as string | null | undefined) ?? null,
        // Campos usados en filtros/búsqueda
        username: (u.username as string | undefined) ?? '',
        email: (u.email as string | undefined) ?? '',
      };
      // rolId derivado
      normalized.rolId = roleByUserId.get((normalized.user_id as number) ?? 0);
      return normalized as UserWithRole;
    });
  }, [usersRaw, userRoles]);

  const isLoading = isLoadingUsers || isLoadingRoles;

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns: EntityTableColumn<UserWithRole>[] = useMemo(
    () => [
      { key: 'user_id', label: usersMessages.id, sortable: true },
      { key: 'email', label: usersMessages.email, sortable: true },
      { key: 'first_name', label: usersMessages.nombre, sortable: true },
      { key: 'second_name', label: usersMessages.segundoNombre, sortable: false },
      { key: 'last_name_p', label: usersMessages.form.apellidoPaterno, sortable: true },
      { key: 'last_name_m', label: usersMessages.form.apellidoMaterno, sortable: true },
      { key: 'is_active', label: usersMessages.status, sortable: true, render: (u) => (u.is_active ? usersMessages.active : usersMessages.inactive) },
    ],
    []
  );

  const filterableColumns: FilterableColumn[] = useMemo(
    () =>
      columns
        .filter((c) => c.key !== 'is_active') // El render personalizado no es filtrable directamente
        .map((c) => ({ key: c.key as string, label: c.label })),
    [columns]
  );

  const filteredData = useMemo(() => {
    let data: UserWithRole[] = [...usuarios];
    const q = searchTerm.trim().toLowerCase();

    if (q) {
      data = data.filter(
        (u) =>
          `${u.first_name} ${u.last_name_p ?? ''} ${u.last_name_m ?? ''}`
            .toLowerCase()
            .includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value) return;
      const lowerCaseValue = value.toLowerCase();
      data = data.filter((row) => {
        const rowValue = row[key as keyof UserWithRole];
        return String(rowValue ?? '').toLowerCase().includes(lowerCaseValue);
      });
    });

    return data;
  }, [usuarios, searchTerm, activeFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const currentTableData = useMemo(
    () =>
      filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      ),
    [filteredData, currentPage, rowsPerPage]
  );


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  const openCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
    setFormReadOnly(false);
  };
  const openEdit = (u: UserWithRole) => {
    setEditing(u);
    setIsFormOpen(true);
    setFormReadOnly(false);
  };
  const openView = (u: UserWithRole) => {
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
    const rows = filteredData.map((u: UserWithRole) => [
      u.user_id,
      u.first_name,
      u.last_name_p ?? '',
      u.last_name_m ?? '',
      u.username,
      u.email,
      u.rolId ?? '',
      u.is_active ? usersMessages.active : usersMessages.inactive,
    ]);
    const csv =
      `${usersMessages.csvHeaders}\n` +
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

  const hasCreatePermission = useAuthStore((s) => s.hasPermission(PERMISSIONS.SECURITY_USERS_CREATE));
  const hasUpdatePermission = useAuthStore((s) => s.hasPermission(PERMISSIONS.SECURITY_USERS_UPDATE));
  const hasDeletePermission = useAuthStore((s) => s.hasPermission(PERMISSIONS.SECURITY_USERS_DELETE));

  return (
    <div className="segu-users">
      <PageHeader title={usersMessages.title} titleSize="1.75rem" />
      {!isFormOpen && (
        <PermissionGate perm={PERMISSIONS.SECURITY_USERS_VIEW}>
          <CommandBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={() => setCurrentPage(1)}
            showFilters={showFilters}
            onToggleFilters={handleToggleFilters}
            filterableColumns={filterableColumns}
            onFilterChange={setActiveFilters}
            onAdd={hasCreatePermission ? openCreate : undefined}
            onRefresh={() => queryClient.invalidateQueries({ queryKey: usersKeys.all })}
            onExportExcel={handleExportCSV}
            searchPlaceholder={usersMessages.searchPlaceholder ?? 'Buscar por nombre, usuario o correo'}
            searchLabel={usersMessages.searchLabel ?? 'Buscar'}
            addLabel={usersMessages.createButton}
            refreshLabel={commonDefaultMessages.refresh}
            filtersLabel={commonDefaultMessages.filters}
            excelLabel={commonDefaultMessages.exportCsv}
          />
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
            {(error as { message?: string } | null)?.message ?? 'Ocurrió un error al cargar los usuarios.'}
          </div>
        )}
        {!isFormOpen && (
          <div className="fs-row-span-2 fs-table-container">
            <PaginatedEntityTable<UserWithRole>
              columns={columns}
              data={currentTableData}
              keyField="user_id"
              autoFit
              centered
              onRowDoubleClick={(row: UserWithRole) => {
                if (hasUpdatePermission) openEdit(row);
                else openView(row);
              }}
              renderActions={(u: UserWithRole) => (
                <>
                  {hasUpdatePermission && (
                    <TableActionsCell
                      onEdit={() => openEdit(u)}
                      editLabel={usersMessages.edit}
                    />
                  )}
                  {hasDeletePermission && (
                    <TableActionsCell
                      onDelete={() => {
                        setDeletingId((u as unknown as { user_id?: number })?.user_id ?? (u as unknown as { userId?: number }).userId ?? null);
                        setConfirmOpen(true);
                      }}
                      deleteLabel={usersMessages.delete}
                    />
                  )}
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
        <div className="segu-users__embedded-form">
          <UserForm
            initialData={
              editing
                ? {
                    ...editing,
                    is_active: Boolean(
                      (editing as unknown as { is_active?: boolean | number })
                        .is_active
                    ),
                    mfa_enabled:
                      ((editing as unknown as { mfa_enabled?: boolean | number })
                        .mfa_enabled === 1 ||
                        (editing as unknown as { mfa_enabled?: boolean | number })
                          .mfa_enabled === true)
                        ? true
                        : false,
                    // Normalize domain -> form snake_case fields for the form
                    user_id: (editing as unknown as { user_id?: number })?.user_id ?? (editing as unknown as { userId?: number }).userId ?? 0,
                    first_name: (editing as unknown as { first_name?: string })?.first_name ?? (editing as unknown as { firstName?: string }).firstName,
                    second_name: (editing as unknown as { second_name?: string | null })?.second_name ?? (editing as unknown as { secondName?: string | null }).secondName ?? null,
                    last_name_p: (editing as unknown as { last_name_p?: string })?.last_name_p ?? (editing as unknown as { lastNameP?: string }).lastNameP,
                    last_name_m: (editing as unknown as { last_name_m?: string | null })?.last_name_m ?? (editing as unknown as { lastNameM?: string | null }).lastNameM ?? null,
                  }
                : undefined
            }
            readOnly={formReadOnly}
            hasEditPermission={hasUpdatePermission}
            onCancel={() => setIsFormOpen(false)}
            onSubmit={async (values) => {
              if (formReadOnly) {
                if (hasUpdatePermission) setFormReadOnly(false);
                return;
              }

              if (!editing) {
                if (!hasCreatePermission) return;
                const dto = toCreateUserDto(values);
                const { password_hash, ...rest } = dto;
                const { apiCall } = await import('@/shared/api/apiCall');
                const createRes = await apiCall(
                  () => create.mutateAsync({
                    ...rest,
                    ...(password_hash != null ? { password_hash } : {}),
                  }),
                  { where: 'security.users.create', toastOnError: true }
                );
                const created = createRes.ok ? createRes.value : undefined;
                if (values.rolId != null) {
                  if (created) {
                    const { apiCall } = await import('@/shared/api/apiCall');
                    const createdId: number = (created as Partial<{ userId: number; user_id: number }>).userId ?? (created as Partial<{ userId: number; user_id: number }>).user_id ?? 0;
                    await apiCall(() => addUserRole(createdId, Number(values.rolId)), { where: 'security.user_roles.assign', toastOnError: true });
                  }
                }
              } else {
                if (!hasUpdatePermission) return;
                const dto = toUpdateUserDto(values);
                const { password_hash: ph, ...restUpdate } = dto as { password_hash?: string | null };
                const { apiCall } = await import('@/shared/api/apiCall');
                await apiCall(
                  () => update.mutateAsync({
                    id: (editing as unknown as { user_id?: number })?.user_id ?? (editing as unknown as { userId?: number }).userId ?? 0,
                    input: ({
                      ...restUpdate,
                      ...(ph != null ? { password_hash: ph } : {}),
                    } as UserInput),
                  }),
                  { where: 'security.users.update', toastOnError: true }
                );
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
          if (deletingId == null) return;
          const { apiCall } = await import('@/shared/api/apiCall');
          const res = await apiCall(
            () => remove.mutateAsync(deletingId),
            { where: 'security.users.delete', toastOnError: true }
          );
          if (res.ok) { setDeletingId(null); setConfirmOpen(false); queryClient.invalidateQueries({ queryKey: usersKeys.all }); }
          return res;
        }}
      />
    </div>
  );
};

export default UsuariosPage;
import './Users.scss';
