import { Component, ErrorInfo, ReactNode } from 'react';
import i18n from '@/i18n/config';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Evita la "pantalla en blanco" si algún componente falla: muestra un mensaje y permite recargar. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="text-center max-w-md space-y-4">
          <h1 className="text-3xl font-playfair font-semibold text-foreground">
            {i18n.t('common.error')}
          </h1>
          <p className="text-muted-foreground">{i18n.t('common.unexpectedError')}</p>
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="btn-hero"
          >
            {i18n.t('notFound.back')}
          </button>
        </div>
      </main>
    );
  }
}
