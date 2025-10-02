import React from 'react';

export type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
};

const sizePx: Record<NonNullable<SpinnerProps['size']>, number> = {
  sm: 16,
  md: 24,
  lg: 36,
};

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', ariaLabel = 'Cargando' }) => {
  const px = sizePx[size];
  return (
    <span role="status" aria-label={ariaLabel} className={`oa-spinner oa-spinner--${size}`}>
      <svg width={px} height={px} viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </span>
  );
};

export default Spinner;

