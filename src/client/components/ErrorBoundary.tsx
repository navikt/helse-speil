import React, { createRef, ReactNode } from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

type ErrorBoundaryProps = {
    fallback: ReactNode;
    onError: (error: Error) => void;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    errorMessageRef: React.RefObject<HTMLParagraphElement>;

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
        this.errorMessageRef = createRef();
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.props.onError(error);
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
        if (prevProps !== this.props && prevState !== this.state) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ hasError: false });
        }
    }

    render() {
        return this.state.hasError ? this.props.fallback : this.props.children;
    }
}
