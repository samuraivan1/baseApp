import React from 'react';
import './LoadingOverlay.scss';
import { commonDefaultMessages } from '@/i18n/commonMessages';

export type LoadingOverlayProps = {
  open: boolean;
  message?: string;
};

export default function LoadingOverlay({ open, message = commonDefaultMessages.loading }: LoadingOverlayProps) {
  if (!open) return null;
  return (
    <div className="loading-overlay" role="status" aria-live="polite" aria-busy>
      <div className="loading-overlay__backdrop" />
      <div className="loading-overlay__content">
        <span className="loading-overlay__spinner" aria-hidden="true" />
        {message ? <div className="loading-overlay__message">{message}</div> : null}
      </div>
    </div>
  );
}
