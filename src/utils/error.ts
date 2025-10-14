import { ApolloError } from '@apollo/client';

type Severity = 'warning' | 'error' | 'info' | 'success';

type SpeilErrorOptions = {
    severity?: Severity;
    scope?: string;
};

export class SpeilError extends Error {
    name = 'speilError';
    severity: Severity = 'error';
    scope: string = window.location.pathname;

    constructor(message?: string, options?: SpeilErrorOptions) {
        super(message);
        if (options) {
            this.severity = options.severity ?? this.severity;
            this.scope = options.scope ?? this.scope;
        }
    }
}

export class InfoAlert extends SpeilError {
    name = 'info';

    constructor(message: string, options?: Omit<SpeilErrorOptions, 'severity'>) {
        super(message, options);
        this.severity = 'info';
    }
}

export const apolloErrorCode = (error: ApolloError | undefined): number =>
    error?.graphQLErrors?.[0]?.extensions?.['code'] as number;

export function apolloExtensionValue<T>(error: ApolloError | undefined, field: string): T | null {
    return error?.graphQLErrors?.[0]?.extensions?.[field] as T;
}
