import React from 'react';
import Button from '@/shared/components/ui/Button';
import { commonDefaultMessages } from '@/i18n/commonMessages';

export type TableActionsCellProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
};

// Non-invasive: optional actions, defaults to common messages
const TableActionsCell: React.FC<TableActionsCellProps> = ({
  onEdit,
  onDelete,
  editLabel = commonDefaultMessages.edit,
  deleteLabel = commonDefaultMessages.delete,
}) => {
  return (
    <>
      {onEdit && (
        <Button variant="link" onClick={onEdit}>{editLabel}</Button>
      )}
      {onDelete && (
        <Button variant="link" tone="danger" onClick={onDelete}>{deleteLabel}</Button>
      )}
    </>
  );
};

export default TableActionsCell;

