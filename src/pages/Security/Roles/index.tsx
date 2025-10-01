import React, { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import CommandBar from '@/components/common/CommandBar';
import EntityTable, {
  EntityTableColumn,
} from '@/components/common/Entitytable';
import Button from '@/components/ui/Button';

import { useRoles, useRoleMutations } from '@/features/security/hooks/useRoles';
import { Role } from '@/types/security';
import rolesMessages from './Roles.messages';
import RoleForm from './RoleForm';
import type { FilterableColumn } from '@/components/common/CommandBar/types';

import './Roles.scss';

const RolesPage: React.FC = () => {
  // Data + Mutations
  const { data: roles = [], isLoading } = useRoles();
  const { create, update, remove } = useRoleMutations();

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Columnas visibles en tabla
  const columns: EntityTableColumn<Role>[] = useMemo(
    () => [
      { key: 'name', label: 'Rol', sortable: true },
      { key: 'description', label: 'Descripción', sortable: true },
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
      const vq = value.toLowerCase();
      data = data.filter((row) =>
        String((row as Record<string, unknown>)[key] ?? '')
          .toLowerCase()
          .includes(vq)
      );
    });

    // 4) Deduplicar por clave primaria para evitar repetidos del backend
    const map = new Map<number, Role>();
    for (const r of data) map.set(r.role_id, r);
    return Array.from(map.values());
  }, [roles, searchTerm, activeFilters]);

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
  const handleOpenAdd = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };
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

      {isLoading ? (
        <div className="loading-container">
          <p>{rolesMessages.loading}</p>
        </div>
      ) : (
        <>
          <div className="fs-row-span-2 fs-table-container">
            {/* ⬇️ QUITAMOS el genérico explícito <Role> para evitar el error */}
            <EntityTable
              columns={columns}
              data={currentTableData}
              keyField="role_id"
              actionColumnWidth="120px"
              autoFit
              centered
              renderActions={(role: Role) => (
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
                      remove.mutate(role.role_id, {
                        onSettled: () => setDeletingId(null),
                      });
                    }}
                  >
                    {rolesMessages.delete}
                  </Button>
                </>
              )}
              pagination={{
                currentPage,
                totalPages,
                onPageChange: setCurrentPage,
                rowsPerPage,
                onRowsPerPageChange: handleRowsPerPageChange,
              }}
            />
          </div>
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
                  update.mutate({ id: editingRole.role_id, input: values });
                } else {
                  create.mutate(values);
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
