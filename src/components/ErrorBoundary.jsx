import { Component } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-md mx-auto">
            <div className="flex items-start">
              <FiAlertTriangle className="text-red-500 text-xl mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-red-800 mb-2">Something went wrong</h3>
                <p className="text-red-700 mb-4">
                  We encountered an error while processing your images. This could be due to 
                  browser limitations or an unsupported image format.
                </p>
                <button
                  onClick={this.handleReset}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
            
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-xs bg-red-100 p-2 rounded border border-red-200">
                <summary className="cursor-pointer mb-2 font-medium">Error Details (Development Only)</summary>
                <p className="mb-1">{this.state.error.toString()}</p>
                <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;