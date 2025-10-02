import React from 'react';
import './FormControls.scss';

type BaseProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  wrapperClassName?: string;
};

export const FormSelect = React.forwardRef<HTMLSelectElement, BaseProps>(
  ({ label, error, wrapperClassName, children, ...rest }, ref) => (
    <div className={`oa-field ${wrapperClassName ?? ''}`}>
      {label && <label className="oa-label">{label}</label>}
      <select ref={ref} className="oa-select" {...rest}>{children}</select>
      {error && <span className="oa-error">{error}</span>}
    </div>
  )
);
FormSelect.displayName = 'FormSelect';

export default FormSelect;
