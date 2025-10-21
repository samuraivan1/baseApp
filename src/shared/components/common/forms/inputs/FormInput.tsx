import React from 'react';
import './FormControls.scss';

type BaseProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  helperText?: string;
  autoComplete?: 'on' | 'off';
  infoTooltip?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
};

export const FormInput = React.forwardRef<HTMLInputElement, BaseProps>(
  ({ label, error, helperText, wrapperClassName, autoComplete, infoTooltip, tooltipPlacement = 'top', id, name, ...rest }, ref) => {
    const tooltipId = infoTooltip ? `${String(id ?? name ?? 'input')}-tt` : undefined;
    return (
      <div className={`oa-field ${wrapperClassName ?? ''}`}>
        {label && (
          <label className="oa-label">
            <span className="oa-label__text">{label}</span>
            {infoTooltip ? (
              <span className="oa-label__info" tabIndex={0} role="img" aria-label="Información" aria-describedby={tooltipId}>
                i
                <span id={tooltipId} className={`oa-tooltip oa-tooltip--${tooltipPlacement}`} role="tooltip">{infoTooltip}</span>
              </span>
            ) : null}
          </label>
        )}
        <input ref={ref} id={id} name={name} className={`oa-input ${error ? 'oa-input--error' : ''}`} autoComplete={autoComplete} {...rest} />
        {!error && helperText && <span className="oa-helper">{helperText}</span>}
        {error && <span className="oa-error">{error}</span>}
      </div>
    );
  }
);
FormInput.displayName = 'FormInput';

export default FormInput;
