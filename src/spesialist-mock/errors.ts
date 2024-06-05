import { GraphQLError, GraphQLErrorOptions } from 'graphql';

export class NotFoundError extends GraphQLError {
    constructor(fnr: string) {
        const message = `Finner ikke data for person med fødselsnummer ${fnr}`;
        super(message, { extensions: { code: 404, field: 'person' } });
    }
}

export class FlereFodselsnumreError extends GraphQLError {
    constructor() {
        super(`Mer enn ett fødselsnummer for personen`, {
            extensions: {
                code: 500,
                feilkode: 'HarFlereFodselsnumre',
                fodselsnumre: ['ddmmåånnnnn', 'ddmmåånnnnn'],
            },
        });
    }
}

export class ManglendeAvviksvurderingError extends GraphQLError {
    constructor() {
        const message = `Exception while fetching data (/person/vilkarsgrunnlag) : Fant ikke avviksvurdering for vilkårsgrunnlagId b60590a3-3e2b-4144-9a76-f957184d8c51`;
        const options: GraphQLErrorOptions = {
            /*
            Skulle egentlig også ha hatt med locations, men jeg skjønner ikke hvordan man gjør det
            locations: [
                {
                    line: 40,
                    column: 5,
                },
            ],
             */
            path: ['person', 'vilkarsgrunnlag'],
        };
        super(message, options);
    }
}
