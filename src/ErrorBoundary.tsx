import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    if (error.message === 'Script error.' || error.message?.includes('ResizeObserver')) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error.message === 'Script error.' || error.message?.includes('ResizeObserver')) return;
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, background: '#450a0a', color: '#fef2f2', fontFamily: 'monospace' }}>
          <h1>Application Crashed</h1>
          <pre style={{ marginTop: 20, fontSize: 14, color: '#fca5a5', whiteSpace: 'pre-wrap' }}>{this.state.error?.message}</pre>
          <pre style={{ marginTop: 20, fontSize: 12, opacity: 0.7, whiteSpace: 'pre-wrap' }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
