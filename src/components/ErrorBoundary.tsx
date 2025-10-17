import React, { PropsWithChildren, ReactNode, createRef } from 'react';

import { getFaro } from '@observability/faro';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

type ErrorBoundaryProps = {
    fallback: ReactNode | ((error: Error) => ReactNode);
    onError?: (error: Error) => void;
};

export class ErrorBoundary extends React.Component<PropsWithChildren<ErrorBoundaryProps>, ErrorBoundaryState> {
    errorMessageRef: React.RefObject<HTMLParagraphElement | null>;

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: undefined };
        this.errorMessageRef = createRef();
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error) {
        getFaro()?.api.pushError(error);
        this.props.onError?.(error);
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
        if (prevProps !== this.props && prevState !== this.state) {
            this.setState({ hasError: false });
        }
    }

    render() {
        const { fallback, children } = this.props;
        const { hasError, error } = this.state;
        if (hasError && error) {
            return typeof fallback === 'function' ? fallback(error) : fallback;
        } else {
            return children;
        }
    }
}
