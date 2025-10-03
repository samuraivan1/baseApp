import React from 'react';
import './FormControls.scss';

type BaseProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  wrapperClassName?: string;
};

export const FormInput = React.forwardRef<HTMLInputElement, BaseProps>(
  ({ label, error, wrapperClassName, ...rest }, ref) => (
    <div className={`oa-field ${wrapperClassName ?? ''}`}>
      {label && <label className="oa-label">{label}</label>}
      <input ref={ref} className="oa-input" {...rest} />
      {error && <span className="oa-error">{error}</span>}
    </div>
  )
);
FormInput.displayName = 'FormInput';

export default FormInput;
