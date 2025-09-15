// src/components/ui/Textarea.tsx
import React from 'react';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string | null;
};

const Textarea: React.FC<Props> = ({ label, error, ...rest }) => {
  return (
    <div className="ui-textarea">
      {label && <label className="ui-textarea__label">{label}</label>}
      <textarea
        className={`ui-textarea__control ${error ? 'is-invalid' : ''}`}
        {...rest}
      />
      {error && <div className="ui-textarea__error">{error}</div>}
    </div>
  );
};

export default React.memo(Textarea);
