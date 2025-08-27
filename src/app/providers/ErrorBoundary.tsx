import React, { Component, ErrorInfo, ReactNode } from "react";
import * as Sentry from "@sentry/react";
import { Button } from "@/shared/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    if (import.meta.env.PROD) {
      Sentry.captureException(error, { extra: errorInfo });
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-3xl font-bold text-destructive mb-4">Oops! Something went wrong.</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            We're sorry for the inconvenience. An unexpected error occurred.
            Please try refreshing the page.
          </p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
