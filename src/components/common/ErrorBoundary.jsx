import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  // Reset error state when children (route) changes
  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.children !== this.props.children) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6 text-center">
          <div className="text-3xl">⚠️</div>
          <h2 className="text-lg font-bold text-terminal-text">Něco se pokazilo</h2>
          <p className="text-sm text-terminal-text/60 max-w-md">
            {this.state.error?.message || 'Nastala neočekávaná chyba.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 text-sm bg-terminal-accent/20 text-terminal-accent border border-terminal-accent/30 rounded hover:bg-terminal-accent/30 transition-colors"
            >
              Zkusit znovu
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm bg-terminal-border/20 text-terminal-text/60 border border-terminal-border/30 rounded hover:bg-terminal-border/30 transition-colors"
            >
              Obnovit stránku
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
