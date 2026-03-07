import * as React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-6 bg-white rounded-3xl border border-zinc-200 shadow-sm">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
            <AlertTriangle size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900">Ops! Algo deu errado.</h2>
            <p className="text-zinc-500 max-w-md mx-auto">
              Ocorreu um erro inesperado ao carregar esta seção. Tente recarregar a página ou limpar os dados.
            </p>
          </div>
          {this.state.error && (
            <pre className="p-4 bg-zinc-50 rounded-xl text-xs text-zinc-400 font-mono max-w-full overflow-auto text-left">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg"
          >
            <RefreshCw size={20} />
            Recarregar Aplicativo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
