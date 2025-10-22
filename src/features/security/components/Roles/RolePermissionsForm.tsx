import React, { useEffect, useMemo, useState } from 'react';
// dnd-kit: flexible, accesible, y ya usado en Kanban.
import {
  DndContext,
  DragEndEvent,
  useDroppable,
  useDraggable,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
// removed unused SortableContext
import SectionHeader from '@/shared/components/common/SectionHeader';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import ListLoading from '@/shared/components/common/ListLoading';
import FormActions from '@/shared/components/common/FormActions';
import { usePermissionsCrud } from '@/features/security';
import { getRolePermissionsList } from '@/features/security';
import {
  addRolePermission,
  removeRolePermissionByPair,
} from '@/features/security/api/relationsService';
import type { Permission, RolePermission, Role } from '@/shared/types/security';
import { apiCall } from '@/shared/api/apiCall';
// Removed unused icon import
import styles from './RolePermissionsForm.module.scss';
import { useRolePermsStore } from './rolePermissions.store';

type Props = {
  role: Role;
  onClose: () => void;
};

export default function RolePermissionsForm({ role, onClose }: Props) {
  const { list: permsQuery } = usePermissionsCrud();
  const assigned = useRolePermsStore((s) => s.assignedIds);
  const availableIds = useRolePermsStore((s) => s.availableIds);
  const reset = useRolePermsStore((s) => s.reset);
  const assign = useRolePermsStore((s) => s.assign);
  const unassign = useRolePermsStore((s) => s.unassign);
  // removed unused reorderAssigned
  const assignMany = useRolePermsStore((s) => s.assignMany);
  const unassignMany = useRolePermsStore((s) => s.unassignMany);
  const [loading, setLoading] = useState(true);

  // Load current role_permissions from mock API
  useEffect(() => {
    let mount = true;
    (async () => {
      try {
        const rows = await getRolePermissionsList();
        const forRole = rows.filter(
          (r) => Number(r.role_id) === Number(role.roleId)
        );
        if (!mount) return;
        const currentAssigned = forRole.map((r) => Number(r.permission_id));
        const allIds = (permsQuery.data ?? []).map((p: Permission) =>
          Number(p.permissionId)
        );
        reset(
          allIds.filter((id) => !currentAssigned.includes(id)),
          currentAssigned
        );
      } finally {
        if (mount) setLoading(false);
      }
    })();
    return () => {
      mount = false;
    };
  }, [role.roleId, reset, permsQuery.data]);

  const allPermissions = useMemo(
    () => (permsQuery.data ?? []) as Permission[],
    [permsQuery.data]
  );
  const available = useMemo(() => {
    const byId = new Set(availableIds);
    return allPermissions.filter((p) => byId.has(Number(p.permissionId)));
  }, [allPermissions, availableIds]);
  const selected = useMemo(
    () =>
      assigned
        .map((id) =>
          allPermissions.find((p) => Number(p.permissionId) === Number(id))
        )
        .filter(Boolean) as Permission[],
    [assigned, allPermissions]
  );

  // Drag from available -> selected or reorder inside selected
  // Droppable zones
  const AvailZone: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isOver, setNodeRef } = useDroppable({ id: 'drop:available' });
    return (
      <div
        ref={setNodeRef}
        className={`${styles['rp-drop']} ${isOver ? styles['rp-list--over'] : ''}`}
      >
        {children}
      </div>
    );
  };
  const AssignZone: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const { isOver, setNodeRef } = useDroppable({ id: 'drop:assigned' });
    return (
      <div
        ref={setNodeRef}
        className={`${styles['rp-drop']} ${isOver ? styles['rp-list--over'] : ''}`}
      >
        {children}
      </div>
    );
  };

  const onDragEnd = (evt: DragEndEvent) => {
    const activeIdStr = String(evt.active?.id ?? '');
    const overIdStr = evt.over ? String(evt.over.id) : '';
    const fromId = Number(activeIdStr.split(':').pop());
    if (!Number.isFinite(fromId)) return;
    if (overIdStr === 'drop:assigned') return assign(fromId);
    if (overIdStr === 'drop:available') return unassign(fromId);
    // reorder desactivado por ahora
  };

  const handleRemove = (id: number) => unassign(id);
  const handleClear = () => unassignMany(assigned);

  // Double click handlers
  const handleAvailableDblClick = (id: number) => assign(id);
  const handleAssignedDblClick = (id: number) => unassign(id);

  const persistChanges = async () => {
    // Fetch current relations and compute diff
    const current: RolePermission[] = await getRolePermissionsList();
    const currentForRole = current.filter((r) => r.role_id === role.roleId);
    const currentIds = new Set(
      currentForRole.map((r) => Number(r.permission_id))
    );
    const nextIds = new Set(assigned);

    const toAdd = [...nextIds].filter((id) => !currentIds.has(id));
    const toRemove = [...currentIds].filter((id) => !nextIds.has(id));

    // Apply add/remove via API
    await apiCall(
      async () => {
        for (const pid of toAdd) {
          await addRolePermission(role.roleId, pid);
        }
        for (const pid of toRemove) {
          await removeRolePermissionByPair(role.roleId, pid);
        }
        return Promise.resolve();
      },
      { where: 'security.role_permissions.persist', toastOnError: true }
    );
    onClose();
  };

  // Pagination state for each list
  const [pageAvail, setPageAvail] = useState(1);
  const [pageAssign, setPageAssign] = useState(1);
  const pageSize = 10;
  const totalAvailPages = Math.max(1, Math.ceil(available.length / pageSize));
  const totalAssignPages = Math.max(1, Math.ceil(selected.length / pageSize));
  const pagedAvailable = available.slice(
    (pageAvail - 1) * pageSize,
    pageAvail * pageSize
  );
  const pagedSelected = selected.slice(
    (pageAssign - 1) * pageSize,
    pageAssign * pageSize
  );

  useEffect(() => {
    setPageAvail(1);
  }, [available.length]);
  useEffect(() => {
    setPageAssign(1);
  }, [selected.length]);

  // dnd-kit sensors (mouse, touch, keyboard)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      pressDelay: 120,
      activationConstraint: { distance: 3 },
    }),
    useSensor(KeyboardSensor)
  );

  // Draggable item component (stable ref per item)
  function DraggablePermItem({
    p,
    kind,
  }: {
    p: Permission;
    kind: 'available' | 'assigned';
  }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: String(p.permissionId),
    });
    if (kind === 'available') {
      return (
        <li
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className={`${styles['rp-item']} ${styles['rp-item--available']} ${isDragging ? styles['rp-item--dragging'] : ''}`}
          onDoubleClick={() => handleAvailableDblClick(Number(p.permissionId))}
        >
          <span className={styles['rp-item__icon']} aria-hidden>
            +
          </span>
          <div className={styles['rp-item__content']}>
            <span className={styles['rp-item__code']}>{p.permissionKey}</span>
            <span className={styles['rp-item__desc']}>
              {p.description ?? ''}
            </span>
          </div>
        </li>
      );
    }
    return (
      <li
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`${styles['rp-item']} ${styles['rp-item--assigned']} ${isDragging ? styles['rp-item--dragging'] : ''}`}
        onDoubleClick={() => handleAssignedDblClick(Number(p.permissionId))}
      >
        <button
          type="button"
          className={styles['rp-item__btn']}
          onClick={() => handleRemove(Number(p.permissionId))}
          aria-label="Quitar"
        >
          ✕
        </button>
        <div className={styles['rp-item__content']}>
          <span className={styles['rp-item__code']}>{p.permissionKey}</span>
          <span className={styles['rp-item__desc']}>{p.description ?? ''}</span>
        </div>
      </li>
    );
  }

  return (
    <div className={styles.rolePerms}>
      <SectionHeader
        title={`Permisos para: ${role.name}`}
        icon={faKey}
        onBack={onClose}
      />
      <ListLoading
        loading={loading || permsQuery.isLoading}
        message="Cargando permisos..."
        showSpinner
        spinnerSize="lg"
        layout="centered"
      >
        <div className={styles.rolePerms__columns}>
          <div className={styles.rolePerms__col}>
            <h4 className={styles.rolePerms__title}>
              Disponibles ({available.length})
            </h4>
            <div className={styles.rolePerms__titlebar}>
              <span />
              <button
                className={styles['rp-pagination__btn']}
                style={{
                  background: '#e6f7ec',
                  borderColor: '#16a34a',
                  color: '#166534',
                }}
                onClick={() =>
                  assignMany(available.map((p) => Number(p.permissionId)))
                }
                disabled={!available.length}
              >
                Asignar todos
              </button>
            </div>
            <DndContext sensors={sensors} onDragEnd={onDragEnd}>
              <AvailZone>
                <ul className={`${styles['rp-list']}`}>
                  {pagedAvailable.map((p) => (
                    <DraggablePermItem
                      key={p.permissionId}
                      p={p}
                      kind="available"
                    />
                  ))}
                </ul>
              </AvailZone>
            </DndContext>
            <div className={styles['rp-pagination']}>
              <button
                className={styles['rp-pagination__btn']}
                onClick={() => setPageAvail((p) => Math.max(1, p - 1))}
                disabled={pageAvail === 1}
              >
                Anterior
              </button>
              <span>
                {pageAvail} / {totalAvailPages}
              </span>
              <button
                className={styles['rp-pagination__btn']}
                onClick={() =>
                  setPageAvail((p) => Math.min(totalAvailPages, p + 1))
                }
                disabled={pageAvail === totalAvailPages}
              >
                Siguiente
              </button>
            </div>
          </div>
          <div className={styles.rolePerms__col}>
            <div className={styles.rolePerms__titlebar}>
              <h4 className={styles.rolePerms__title}>
                Asignados ({selected.length})
              </h4>
              {!!assigned.length && (
                <button
                  type="button"
                  className={styles['rp-pagination__btn']}
                  style={{
                    background: '#fdecec',
                    borderColor: '#dc2626',
                    color: '#991b1b',
                  }}
                  onClick={handleClear}
                >
                  Quitar todos
                </button>
              )}
            </div>
            <DndContext sensors={sensors} onDragEnd={onDragEnd}>
              <AssignZone>
                <ul
                  className={`${styles['rp-list']} ${styles['rp-list--assigned']}`}
                >
                  {pagedSelected.map((p) => (
                    <DraggablePermItem
                      key={p.permissionId}
                      p={p}
                      kind="assigned"
                    />
                  ))}
                </ul>
              </AssignZone>
            </DndContext>
            <div className={styles['rp-pagination']}>
              <button
                className={styles['rp-pagination__btn']}
                onClick={() => setPageAssign((p) => Math.max(1, p - 1))}
                disabled={pageAssign === 1}
              >
                Anterior
              </button>
              <span>
                {pageAssign} / {totalAssignPages}
              </span>
              <button
                className={styles['rp-pagination__btn']}
                onClick={() =>
                  setPageAssign((p) => Math.min(totalAssignPages, p + 1))
                }
                disabled={pageAssign === totalAssignPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
        <div className={styles.rolePerms__footer}>
          <FormActions onCancel={onClose} onAccept={persistChanges} />
        </div>
      </ListLoading>
    </div>
  );
}
