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

export class ErrorAlert extends SpeilError {}

export class InfoAlert extends SpeilError {
    name = 'info';

    constructor(message: string, options?: Omit<SpeilErrorOptions, 'severity'>) {
        super(message, options);
        this.severity = 'info';
    }
}

export class LazyLoadPendingError extends Error {}

export class LazyLoadError extends Error {
    constructor(message?: string) {
        super(message ?? 'Kunne ikke laste inn deler av siden. Kontakt en utvikler.');
        this.name = 'LazyLoadError';
    }
}

export const onLazyLoadFail = (error: Error): Promise<never> => {
    const numberOfTimesFailed = Number(window.sessionStorage.getItem(error.message));

    if (numberOfTimesFailed < 2) {
        window.sessionStorage.setItem(error.message, `${numberOfTimesFailed + 1}`);
        window.location.reload();
        return Promise.reject(new LazyLoadPendingError());
    } else {
        return Promise.reject(new LazyLoadError());
    }
};
