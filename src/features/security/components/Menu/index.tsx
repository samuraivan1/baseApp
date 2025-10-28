import React, { useMemo, useState, useEffect } from 'react';
import PageHeader from '@/shared/components/common/PageHeader';
import CommandBar from '@/shared/components/common/CommandBar';
import PermissionGate from '@/shared/components/PermissionGate';
import PaginatedEntityTable from '@/shared/components/common/PaginatedEntityTable';
import type { EntityTableColumn } from '@/shared/components/common/Entitytable';
import type { FilterableColumn } from '@/shared/components/common/CommandBar/types';
import { menuMessages } from './Menu.messages';
import { commonDefaultMessages } from '@/i18n/commonMessages';
import { PERMISSIONS } from '@/features/security/constants/permissions';
import type { IMenu } from '@/features/security/types/models';
import { useMenuCrud } from '@/features/security';
import { showToast } from '@/shared/utils/showToast';
import type { MenuFormValues } from './menu.schema';
import ListLoading from '@/shared/components/common/ListLoading';
import MenuForm from '../Menu/MenuForm';
import { useAuthStore } from '@/features/shell/state/authStore';
import TableActionsCell from '@/shared/components/common/TableActionsCell';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';
import { exportCsv } from '@/shared/utils/exportCsv'; // Import exportCsv

const MenuPage: React.FC = () => {
  const { list, update, create, remove } = useMenuCrud();
  const { data: menus = [], isLoading } = list as {
    data: IMenu[];
    isLoading: boolean;
  };
  const updateMut = update;
  const createMut = create;
  const deleteMut = remove;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [justUpdatedId, setJustUpdatedId] = useState<number | null>(null);

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<IMenu | null>(null);
  const [formReadOnly, setFormReadOnly] = useState(true);

  const columns: EntityTableColumn<IMenu>[] = useMemo(
    () => [
      { key: 'title', label: menuMessages.table.title, sortable: true },
      { key: 'iconKey', label: menuMessages.table.iconKey },
      { key: 'route', label: menuMessages.table.route, sortable: true },
      { key: 'permissionString', label: menuMessages.table.permissionString },
    ],
    []
  );

  const filterableColumns: FilterableColumn[] = useMemo(
    () => [
      { key: 'title', label: menuMessages.table.title },
      { key: 'route', label: menuMessages.table.route },
      { key: 'permissionString', label: menuMessages.table.permissionString },
    ],
    []
  );
  const allowedFilterKeys = useMemo(
    () => filterableColumns.map((c) => c.key) as Array<keyof IMenu>,
    [filterableColumns]
  );

  const filteredData = useMemo(() => {
    let data: IMenu[] = [...menus];
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.route ?? '').toLowerCase().includes(q) ||
          (m.permissionString ?? '').toLowerCase().includes(q) ||
          (m.iconKey ?? '').toLowerCase().includes(q)
      );
    }
    Object.entries(activeFilters).forEach(([k, v]) => {
      if (!v) return;
      const vv = v.toLowerCase();
      if (!allowedFilterKeys.includes(k as keyof IMenu)) return;
      data = data.filter((row) =>
        String(row[k as keyof IMenu] ?? '')
          .toLowerCase()
          .includes(vv)
      );
    });
    // Dedupe by menuId
    const map = new Map<number, IMenu>();
    for (const r of data) map.set(r.menuId, r);
    return Array.from(map.values());
  }, [menus, searchTerm, activeFilters, allowedFilterKeys]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const currentTableData = useMemo(
    () =>
      filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      ),
    [filteredData, currentPage, rowsPerPage]
  );

  // Effect to scroll and highlight updated row
  useEffect(() => {
    if (justUpdatedId == null) return;
    const el = document.querySelector(`[data-row-id="${justUpdatedId}"]`) as HTMLElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('row-flash');
    const t = setTimeout(() => {
      el.classList.remove('row-flash');
      setJustUpdatedId(null);
    }, 2200);
    return () => clearTimeout(t);
  }, [justUpdatedId]);

  // Reset page on filter/search change
  useEffect(() => {
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
    const rows = filteredData.map((m) => [
      m.menuId,
      m.title,
      m.iconKey ?? '',
      m.route ?? '',
      m.permissionString ?? '',
    ]);
    exportCsv(
      menuMessages.csv.filename,
      menuMessages.csv.headers,
      rows
    );
  }, [filteredData]);

  // Listen for edit request from embedded form
  useEffect(() => {
    const handler = () => {
      const canEdit = useAuthStore
        .getState()
        .hasPermission(PERMISSIONS.SECURITY_MENU_UPDATE);
      if (isFormOpen && formReadOnly && canEdit) { // Use formReadOnly here
        setFormReadOnly(false);
      }
    };
    document.addEventListener(
      'menuform:request-edit',
      handler as EventListener
    );
    return () =>
      document.removeEventListener(
        'menuform:request-edit',
        handler as EventListener
      );
  }, [isFormOpen, formReadOnly]); // Add formReadOnly to dependencies

  return (
    <div className="menu-page">
      <PageHeader title={menuMessages.title} titleSize="1.75rem" />

      {!isFormOpen && (
        <PermissionGate perm={PERMISSIONS.SECURITY_MENU_VIEW}>
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
                .hasPermission(PERMISSIONS.SECURITY_MENU_CREATE)
                ? () => {
                    setEditing(null);
                    setIsFormOpen(true);
                    setFormReadOnly(false);
                  }
                : undefined
            }
            onRefresh={() => window.location.reload()}
            onExportExcel={handleExportCSV}
            searchPlaceholder={menuMessages.searchPlaceholder}
            searchLabel={menuMessages.searchLabel}
            addLabel={
              useAuthStore
                .getState()
                .hasPermission(PERMISSIONS.SECURITY_MENU_CREATE)
                ? menuMessages.createButton
                : undefined
            }
            refreshLabel={commonDefaultMessages.refresh}
            filtersLabel={commonDefaultMessages.filters}
            excelLabel={commonDefaultMessages.exportCsv}
          />

          <ListLoading
            loading={isLoading}
            message={menuMessages.loading}
            showSpinner
            spinnerSize="lg"
            layout="centered"
            containerClassName="loading-container loading-container--fullscreen"
          >
            <div className="fs-row-span-2 fs-table-container">
              <PaginatedEntityTable<IMenu>
                columns={columns}
                data={currentTableData}
                keyField={"menuId"}
                autoFit
                centered
                getRowProps={(row) => ({ ['data-row-id']: String(row.menuId) } as React.HTMLAttributes<HTMLTableRowElement>)}
                onRowDoubleClick={(row) => {
                  setEditing(row);
                  setIsFormOpen(true);
                  setFormReadOnly(true);
                }}
                renderActions={(() => {
                  const canEdit = useAuthStore
                    .getState()
                    .hasPermission(PERMISSIONS.SECURITY_MENU_UPDATE);
                  const canDelete = useAuthStore
                    .getState()
                    .hasPermission(PERMISSIONS.SECURITY_MENU_DELETE);
                  const show = canEdit || canDelete;
                  if (!show) return undefined;
                  const ActionsRenderer: React.FC<IMenu> = (row: IMenu) => (
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
                            setDeletingId(row.menuId);
                            setConfirmOpen(true);
                          }}
                          deleteLabel={commonDefaultMessages.delete}
                        />
                      )}
                    </>
                  );
                  ActionsRenderer.displayName = 'MenuActionsRenderer';
                  return ActionsRenderer as unknown as (
                    row: IMenu
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
        <div className="menu-page__embedded-form">
          <div className="segu-permissions__card">
            <MenuForm
              open={isFormOpen}
              readOnly={formReadOnly}
              hasEditPermission={useAuthStore
                .getState()
                .hasPermission(PERMISSIONS.SECURITY_MENU_UPDATE)}
              initialValues={editing ?? undefined}
              onClose={() => {
                setIsFormOpen(false);
                setEditing(null);
                setFormReadOnly(true);
              }}
            onSubmit={async (values: MenuFormValues) => {
              const dtoTyped = {
                titulo: values.title,
                iconKey: values.iconKey,
                ruta: values.route,
                permission_string: values.permissionString || null,
              };
              const { apiCall } = await import('@/shared/api/apiCall');
              if (editing) {
                const canUpdate = useAuthStore
                  .getState()
                  .hasPermission(PERMISSIONS.SECURITY_MENU_UPDATE);
                if (!canUpdate) return;
                const res = await apiCall(
                  () =>
                    updateMut.mutateAsync({
                      id: editing.menuId,
                      input: dtoTyped,
                    }),
                  { where: 'security.menu.update', toastOnError: true }
                );
                if (res.ok) {
                  showToast.success(menuMessages.updateSuccess);
                  setIsFormOpen(false);
                  setEditing(null);
                  setJustUpdatedId(editing.menuId);
                  setFormReadOnly(true);
                }
              } else {
                const canCreate = useAuthStore
                  .getState()
                  .hasPermission(PERMISSIONS.SECURITY_MENU_CREATE);
                if (!canCreate) return;
                const res = await apiCall(() => createMut.mutateAsync(dtoTyped), {
                  where: 'security.menu.create',
                  toastOnError: true,
                });
                if (res.ok) {
                  showToast.success(menuMessages.createSuccess);
                  setIsFormOpen(false);
                  setFormReadOnly(true);
                  const created = res.value as IMenu | undefined;
                  if (created && created.menuId)
                    setJustUpdatedId(created.menuId);
                }
              }
            }}
          />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={menuMessages.deleteTitle}
        message={menuMessages.deleteMessage}
        confirmLabel={commonDefaultMessages.delete}
        cancelLabel={commonDefaultMessages.cancel}
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          if (deletingId == null) return;
          const { apiCall } = await import('@/shared/api/apiCall');
          const res = await apiCall(() => deleteMut.mutateAsync(deletingId), {
            where: 'security.menu.delete',
            toastOnError: true,
          });
          if (res.ok) {
            setDeletingId(null);
            setConfirmOpen(false);
          }
          return res;
        }}
      />
    </div>
  );
};

MenuPage.displayName = 'MenuPage';
export default MenuPage;
