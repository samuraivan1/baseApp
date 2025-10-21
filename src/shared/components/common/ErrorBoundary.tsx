import React from 'react';
import { QueryClient } from '@tanstack/react-query';

type Props = {
  children: React.ReactNode;
  queryClient?: QueryClient;
};

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(_error: unknown) {
    // Optionally log via errorService if desired
    // import('@/shared/api/errorService').then(({ default: svc, normalizeError }) => svc.logError(normalizeError(error)));
  }
  handleReload = () => {
    window.location.reload();
  };
  handleClearRQ = async () => {
    if (import.meta.env.DEV && this.props.queryClient) {
      this.props.queryClient.clear();
      window.location.reload();
    }
  };
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Algo salió mal.</h2>
          <p>Intenta recargar la página.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={this.handleReload}>Recargar</button>
            {import.meta.env.DEV ? (
              <button onClick={this.handleClearRQ}>Limpiar cache (RQ)</button>
            ) : null}
          </div>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
