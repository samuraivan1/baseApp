import React from 'react';
import './FormControls.scss';

type BaseProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  helperText?: string;
};

export const FormInput = React.forwardRef<HTMLInputElement, BaseProps>(
  ({ label, error, helperText, wrapperClassName, ...rest }, ref) => (
    <div className={`oa-field ${wrapperClassName ?? ''}`}>
      {label && <label className="oa-label">{label}</label>}
      <input ref={ref} className="oa-input" {...rest} />
      {!error && helperText && <span className="oa-helper">{helperText}</span>}
      {error && <span className="oa-error">{error}</span>}
    </div>
  )
);
FormInput.displayName = 'FormInput';

export default FormInput;
