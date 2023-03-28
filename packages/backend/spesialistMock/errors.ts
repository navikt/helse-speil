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

export class FlereFodselsnumreError extends BaseError {
    constructor() {
        super(`Mer enn ett fødselsnummer for personen`);
        this.extensions = {
            code: 500,
            feilkode: 'HarFlereFodselsnumre',
            fodselsnumre: ['ddmmåånnnnn', 'ddmmåånnnnn'],
        };
    }
}
