// components/ErrorBoundary.tsx
'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service (e.g., Sentry, LogRocket)
    console.error('Error caught by boundary:', error, errorInfo);
    
    // In production, you might want to send this to an error reporting service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { react: { errorInfo } } });
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 text-red-500">
                <AlertTriangle className="h-full w-full" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                We apologize for the inconvenience. An error occurred while loading this section.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left text-xs bg-gray-100 p-4 rounded overflow-auto max-h-32">
                  <summary className="cursor-pointer font-medium text-red-600 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Page
                </Button>
                
                <Button
                  onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mt-4">
                If this problem persists, please contact our support team.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error caught by hook:', error, errorInfo);
    
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Send to error reporting service
    }
  };
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
