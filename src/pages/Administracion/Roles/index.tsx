import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import logger from '@/services/logger';
import { getRoles, deleteRol } from '@/services/adminService';
import RoleForm from './RoleForm';
import { rolesMessages } from './Roles.messages';
import './Roles.scss';
import { Rol } from '@/pages/Administracion/types';

import PageHeader from '@/components/common/PageHeader';
import CommandBar from '@/components/common/CommandBar';
import AdminTable, { ColumnDefinition } from '@/components/common/AdminTable';
import Pagination from '@/components/common/Pagination';
import  DynamicFilter from '@/components/common/DynamicFilter';
import { FilterableColumn } from '@/components/common/DynamicFilter/types';




const RolesPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Rol | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );

  const {
    data: roles,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteRol(id),
    onSuccess: () => {
      toast.success(rolesMessages.deleteSuccess);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (err: any) => {
      logger.error(err);
      toast.error(rolesMessages.genericError);
    },
  });

  const handleOpenCreate = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (role: Rol) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // ✅ --- LÓGICA DE FILTRADO REFACTORIZADA --- ✅
  const filteredRoles = useMemo(() => {
    if (!roles) return [];

    return roles.filter((role) => {
      // 1. Filtrado por el campo de búsqueda general (CommandBar)
      const matchesSearchTerm =
        searchTerm === '' ||
        role.nombre.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Filtrado por los filtros dinámicos
      const matchesDynamicFilters = Object.entries(activeFilters).every(
        ([field, value]) => {
          // Si el valor del filtro está vacío, no se aplica este filtro
          if (value === '') return true;

          const roleValue = role[field as keyof Rol];

          // Comprobamos que el valor del rol exista y sea un string antes de comparar
          return (
            typeof roleValue === 'string' &&
            roleValue.toLowerCase().includes(value.toLowerCase())
          );
        }
      );

      // El rol debe cumplir con ambas condiciones
      return matchesSearchTerm && matchesDynamicFilters;
    });
  }, [roles, searchTerm, activeFilters]);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return filteredRoles.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, rowsPerPage, filteredRoles]);

  const totalPages = Math.ceil(filteredRoles.length / rowsPerPage);

  const columns: ColumnDefinition<Rol>[] = [
    { header: 'Rol', accessor: 'nombre', isPrincipal: true },
    { header: 'Descripción', accessor: 'descripcion' },
  ];

  const filterableColumns: FilterableColumn[] = [
    { key: 'nombre', label: 'Nombre de Rol' },
    { key: 'descripcion', label: 'Descripción' },
  ];

  return (
    <div className="admin-page-container">
      <PageHeader title={rolesMessages.title} titleSize="1.75rem" />

      <CommandBar
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        onAdd={handleOpenCreate}
        onRefresh={refetch}
        addLabel="Añadir Rol"
        searchLarge={true}
        searchPlaceholder="Buscar por nombre de rol..."
      />

      <DynamicFilter
        columns={filterableColumns}
        onFilterChange={setActiveFilters}
      />

      {isLoading ? (
        <div className="loading-container">
          <p>Cargando roles...</p>
        </div>
      ) : (
        <>
          <AdminTable
            columns={columns}
            data={currentTableData}
            keyField="idRol"
            renderActions={(role) => (
              <>
                <button
                  className="action-link"
                  onClick={() => handleOpenEdit(role)}
                >
                  Actualizar
                </button>
                <button
                  className="action-link action-link--danger"
                  onClick={() => deleteMutation.mutate(role.idRol)}
                >
                  Eliminar
                </button>
              </>
            )}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}

      {isModalOpen && (
        <div className="admin-roles__modal">
          <div className="admin-roles__modal-content">
            <RoleForm
              initialData={editingRole || undefined}
              onCancel={() => setIsModalOpen(false)}
              onSuccess={() => {
                setIsModalOpen(false);
                queryClient.invalidateQueries({ queryKey: ['roles'] });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;