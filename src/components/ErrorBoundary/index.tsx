import React, { ReactNode, ErrorInfo } from 'react'; // ✅ 1. Importa tipos de React
import logger from '@/services/logger';
import { errorBoundaryText } from './ErrorBoundary.messages';
import './ErrorBoundary.scss'; // ✅ 1. Importa los estilos

// ✅ 2. Define la "forma" de las props que el componente espera.
//    En este caso, espera 'children' que pueden ser cualquier cosa renderizable.
interface ErrorBoundaryProps {
  children: ReactNode;
}

// ✅ 3. Define la "forma" del estado interno del componente.
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
// ✅ 4. Aplica los tipos al componente de clase.
//    La sintaxis es React.Component<Props, State>.
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    //console.error('ErrorBoundary atrapó un error:', error, errorInfo);
    logger.error(error, { componentStack: errorInfo.componentStack });
  }

  render() {
    if (this.state.hasError) {
      // ✅ 2. Usa las clases BEM
      return (
        <div className="error-boundary">
          <h2 className="error-boundary__title">{errorBoundaryText.title}</h2>
          <p className="error-boundary__message">{errorBoundaryText.message}</p>
          <button
            className="error-boundary__button"
            onClick={() => window.location.reload()}
          >
            {errorBoundaryText.reloadButton}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
