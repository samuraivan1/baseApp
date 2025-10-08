import React from 'react';
import './styles.scss';

export type DetailField<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type DetailDrawerProps<T> = {
  title: string;
  open: boolean;
  data: T | null;
  fields: ReadonlyArray<DetailField<T>>;
  onClose: () => void;
};

export default function DetailDrawer<T>({ title, open, data, fields, onClose }: DetailDrawerProps<T>) {
  if (!open || !data) return null;
  return (
    <div className="detail-drawer__backdrop" onClick={onClose}>
      <div className="detail-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="detail-drawer__header">
          <h3>{title}</h3>
          <button className="detail-drawer__close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        <div className="detail-drawer__content">
          {fields.map((f) => (
            <div className="detail-drawer__row" key={String(f.key)}>
              <div className="detail-drawer__label">{f.label}</div>
              <div className="detail-drawer__value">
                {f.render ? f.render(data) : String((data as any)[f.key] ?? '')}
              </div>
            </div>
          ))}
        </div>
        <div className="detail-drawer__footer">
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

