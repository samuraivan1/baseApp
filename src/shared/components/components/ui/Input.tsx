// src/components/ui/Input.tsx
import React from 'react';
import './Input.scss';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
};

const Input: React.FC<Props> = ({ label, error, ...rest }) => {
  return (
    <div className="ui-input">
      {label && <label className="ui-input__label">{label}</label>}
      <input
        className={`ui-input__control ${error ? 'is-invalid' : ''}`}
        {...rest}
      />
      {error && <div className="ui-input__error">{error}</div>}
    </div>
  );
};

export default React.memo(Input);
