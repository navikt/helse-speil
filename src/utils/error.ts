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
    (
        error?.graphQLErrors?.[0].extensions?.['code'] as {
            value: number;
        }
    ).value;

export const apolloExtensionValue = (error: ApolloError | undefined, field: string): string | null =>
    (
        error?.graphQLErrors?.[0].extensions?.[field] as {
            value: string;
        }
    )?.value;
