// src/components/ErrorBoundary/index.tsx
import React from 'react';
import errorService, { normalizeError } from '@/shared/api/errorService';
import { toast } from 'react-toastify';
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

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReport = () => {
    const { error } = this.state;
    if (!error) return;

    const normalized = normalizeError(error, {
      source: 'error-boundary-report',
    });
    errorService.logError(normalized);

    // Notificación no intrusiva en lugar de alert()
    toast.error('Ha ocurrido un error inesperado. Por favor contacte al administrador.');
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
          <button style={{ marginLeft: 12 }} onClick={this.handleReset}>
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
