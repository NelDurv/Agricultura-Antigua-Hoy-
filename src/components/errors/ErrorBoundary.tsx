import React from 'react';

interface Props { children: React.ReactNode; fallback?: React.ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-red-200 bg-red-50 text-center">
          <p className="text-red-700 font-medium mb-2">Algo salió mal en esta sección</p>
          <p className="text-red-500 text-sm mb-3">{this.state.error?.message}</p>
          <button onClick={this.handleRetry} className="px-4 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
