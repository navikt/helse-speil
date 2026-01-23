import { GraphQLError, GraphQLErrorOptions } from 'graphql';

export class NotReadyError extends GraphQLError {
    constructor() {
        super(`Person med fødselsnummer ... er ikke klar for visning ennå`, {
            extensions: {
                code: 409,
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
