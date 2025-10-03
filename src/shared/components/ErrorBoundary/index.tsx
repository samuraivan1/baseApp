// src/components/ErrorBoundary/index.tsx
import React from 'react';
import errorService, { normalizeError } from '@/shared/api/errorService';
import { errorBoundaryText } from './ErrorBoundary.messages';

type Props = { children: React.ReactNode };

type State = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const normalized = normalizeError(error, {
      source: 'error-boundary',
      errorInfo,
    });
    errorService.logError(normalized);
  }

  private handleReport = () => {
    const { error } = this.state;
    if (!error) return;

    const normalized = normalizeError(error, {
      source: 'error-boundary-report',
    });
    errorService.logError(normalized);

    // Aquí podrías mostrar un toast o redirigir a soporte
    alert('El error ha sido registrado. Gracias por reportarlo.');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>{errorBoundaryText.title}</h2>
          <p>{errorBoundaryText.message}</p>
          <button onClick={this.handleReport}>
            {errorBoundaryText.reportButton}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
