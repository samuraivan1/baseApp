import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import logger from '@/shared/api/logger';
import { getUsers, deleteUser } from '@/features/security/api/userService';
import { getUserRoles } from '@/features/security/api/relationsService';
import PageHeader from '@/shared/components/common/PageHeader';
import CommandBar from '@/shared/components/common/CommandBar';
import {
  EntityTableColumn,
} from '@/shared/components/common/Entitytable';
import PaginatedEntityTable from '@/shared/components/common/PaginatedEntityTable';
// import Pagination from '@/shared/components/common/Pagination';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';
import UserForm from './UserForm';
import { usersMessages } from './Users.messages';
import './Users.scss';
import { commonDefaultMessages } from '@/i18n/commonMessages';
import type { User } from '@/shared/types/security';
import type { FilterableColumn } from '@/shared/components/common/CommandBar/types';
import TableActionsCell from '@/shared/components/common/TableActionsCell';
import PermissionGate from '@/shared/components/common/PermissionGate';
import { ActionPermissions as AP } from '@/features/security/constants/permissions';
import ListLoading from '@/shared/components/common/ListLoading';

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async (): Promise<UserView[]> => {
      const [users, userRoles] = await Promise.all([
        getUsers(),
        getUserRoles(),
      ]);
      const roleByUser = new Map(
        userRoles.map((ur) => [ur.user_id, ur.role_id])
      );
      return users.map((u: User) => ({
        idUsuario: u.user_id,
        nombre: u.first_name,
        segundoNombre: u.second_name ?? undefined,
        apellidoPaterno: u.last_name_p,
        apellidoMaterno: u.last_name_m ?? undefined,
        correoElectronico: u.email,
        nombreUsuario: u.username,
        status: u.is_active === 1 ? 'activo' : 'inactivo',
        rolId: roleByUser.get(u.user_id) ?? undefined,
      }));
    },
  });

  // CommandBar state
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Columns
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

  // Filter + pagination
  const filteredData = useMemo(() => {
    let data = usuarios;
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
    for (const r of data) map.set(r.idUsuario, r);
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

  // Mutations
  const delMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      toast.success(usersMessages.deleteSuccess);
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (err: unknown) => {
      const error =
        err instanceof Error ? err : new Error('Error eliminando usuario');
      logger.error(error, { context: 'deleteUsuario', original: err });
      toast.error(usersMessages.genericError);
    },
    onSettled: () => {
      setDeletingId(null);
      setConfirmOpen(false);
    },
  });

  // Handlers
  const openCreate = () => { setEditing(null); setIsFormOpen(true); };
  const openEdit = (u: UserView) => {
    setEditing(u);
    setIsFormOpen(true);
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
      <PermissionGate perm={AP.USER_CREATE}>
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
        searchPlaceholder={
          usersMessages.searchPlaceholder ??
          'Buscar por nombre, usuario o correo'
        }
        searchLabel={usersMessages.searchLabel ?? 'Buscar'}
        addLabel={usersMessages.createButton}
        refreshLabel={commonDefaultMessages.refresh}
        filtersLabel={commonDefaultMessages.filters}
        excelLabel={commonDefaultMessages.exportCsv}
      />
      </PermissionGate>)}

      <ListLoading
        loading={isLoading}
        message={usersMessages.loading}
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
            keyField="idUsuario"
            autoFit
            centered
            renderActions={(u: UserView) => (
              <>
                <PermissionGate perm={AP.USER_EDIT}>
                  <TableActionsCell onEdit={() => openEdit(u)} editLabel={usersMessages.edit} />
                </PermissionGate>
                <PermissionGate perm={AP.USER_DELETE}>
                  <TableActionsCell onDelete={() => { setDeletingId(u.idUsuario); setConfirmOpen(true); }} deleteLabel={usersMessages.delete} />
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
        <div className="segu-users__embedded-form">
          <PermissionGate perm={editing ? AP.USER_EDIT : AP.USER_CREATE}>
            <UserForm
              initialData={editing || undefined}
              onCancel={() => setIsFormOpen(false)}
              onSuccess={() => {
                setIsFormOpen(false);
                queryClient.invalidateQueries({ queryKey: ['usuarios'] });
              }}
            />
          </PermissionGate>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={usersMessages.deleteUserTitle ?? 'Eliminar Usuario'}
        message={
          usersMessages.deleteUserMessage ??
          '¿Deseas eliminar este usuario? Esta acción no se puede deshacer.'
        }
        confirmLabel={usersMessages.delete}
        cancelLabel={commonDefaultMessages.cancel}
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (deletingId != null) delMutation.mutate(deletingId);
        }}
      />
    </div>
  );
};

export default UsuariosPage;
