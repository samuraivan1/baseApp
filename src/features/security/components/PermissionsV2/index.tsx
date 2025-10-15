import React, { useMemo, useState } from 'react';
import PageHeader from '@/shared/components/common/PageHeader';
import CommandBar from '@/shared/components/common/CommandBar';
import PermissionGate from '@/shared/components/PermissionGate';
import PaginatedEntityTable from '@/shared/components/common/PaginatedEntityTable';
import type { EntityTableColumn } from '@/shared/components/common/Entitytable';
import type { FilterableColumn } from '@/shared/components/common/CommandBar/types';
import { permissionsMessages } from '../Permissions/Permissions.messages';
import { commonDefaultMessages } from '@/i18n/commonMessages';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import type { Permission } from '@/features/security/types';
import { usePermissionsCrud } from '@/features/security';
import ListLoading from '@/shared/components/common/ListLoading';

// Permisos 2 — vista solo lectura con búsqueda, filtros y export CSV
const PermissionsV2Page: React.FC = () => {
  const { list } = usePermissionsCrud();
  const { data: permissions = [], isLoading } = list as {
    data: Permission[];
    isLoading: boolean;
  };

  // Estado UI
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleExportCSV = () => {
    const rows = filteredData.map((p) => [
      //p.permission_id,
      p.permission_string,
      p.resource ?? '',
      p.action ?? '',
      p.scope ?? '',
      p.description ?? '',
    ]);
    const csv =
      /*permission_id,*/ 'Clave,Recurso,Acción,Ambito, Descripción' +
      rows
        .map((r) =>
          r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')
        )
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'permissions_v2.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="segu-permisos-v2">
      <PageHeader
        title={permissionsMessages.title + ' 2'}
        titleSize="1.75rem"
      />

      <PermissionGate perm={PERMISSIONS.SECURITY_PERMISSIONS_VIEW}>
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
          searchPlaceholder={permissionsMessages.searchPlaceholder}
          searchLabel={permissionsMessages.searchLabel}
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
    </div>
  );
};

export default PermissionsV2Page;
