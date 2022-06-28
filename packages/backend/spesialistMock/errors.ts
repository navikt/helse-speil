class BaseError extends Error {
    extensions: Extension;
}

export class NotFoundError extends BaseError {
    constructor(fnr: string) {
        const message = `Finner ikke data for person med fødselsnummer ${fnr}`;
        super(message);
        this.extensions = { code: 404, field: 'person' };
    }
}

export class ProtectedPersonError extends BaseError {
    constructor(fnr: string) {
        const message = `Har ikke tilgang til person med fødselsnummer ${fnr}`;
        super(message);
        this.extensions = { code: 403, field: 'person' };
    }
}
