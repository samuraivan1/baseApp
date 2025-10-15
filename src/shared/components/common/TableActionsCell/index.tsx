import React from 'react';
import Button from '@/shared/components/ui/Button';
import { commonDefaultMessages } from '@/i18n/commonMessages';

export type TableActionsCellProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  onCustomAction?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  customLabel?: string;
  customIcon?: string;
};

// Non-invasive: optional actions, defaults to common messages
const TableActionsCell: React.FC<TableActionsCellProps> = ({
  onEdit,
  onDelete,
  onCustomAction,
  editLabel = commonDefaultMessages.edit,
  deleteLabel = commonDefaultMessages.delete,
  customLabel,
}) => {
  return (
    <>
      {onEdit && (
        <Button variant="link" onClick={onEdit}>{editLabel}</Button>
      )}
      {onDelete && (
        <Button variant="link" tone="danger" onClick={onDelete}>{deleteLabel}</Button>
      )}
      {onCustomAction && (
        <Button variant="ghost" onClick={onCustomAction}>{customLabel ?? 'Permisos'}</Button>
      )}
    </>
  );
};

export default TableActionsCell;
