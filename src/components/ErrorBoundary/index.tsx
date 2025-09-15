// src/components/ErrorBoundary/index.tsx
import React from 'react';
import errorService, { normalizeError } from '@/services/errorService';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: any };

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    const norm = normalizeError(error, {
      componentStack: info?.componentStack,
    });
    errorService.logError(norm);
  }

  handleReport = () => {
    if (!this.state.error) return;
    const norm = normalizeError(this.state.error, {
      userAction: 'User reported from ErrorBoundary',
    });
    errorService.logError(norm);
    alert('Gracias — el error ha sido registrado.');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Algo salió mal</h2>
          <p>
            Estamos trabajando para solucionarlo. Puedes reportarlo para ayudar.
          </p>
          <button onClick={this.handleReport}>Reportar error</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
