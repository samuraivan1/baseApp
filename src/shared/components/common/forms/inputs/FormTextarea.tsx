import React from 'react';
import './FormControls.scss';

type BaseProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  wrapperClassName?: string;
};

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, BaseProps>(
  ({ label, error, wrapperClassName, ...rest }, ref) => (
    <div className={`oa-field ${wrapperClassName ?? ''}`}>
      {label && <label className="oa-label">{label}</label>}
      <textarea ref={ref} className="oa-textarea" {...rest} />
      {error && <span className="oa-error">{error}</span>}
    </div>
  )
);
FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
