import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import possibletypes from '@io/graphql/generated/possibletypes';

const baseUrlGraphQL = (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '') + '/graphql';

export const client = new ApolloClient({
    link: new HttpLink({ uri: baseUrlGraphQL }),
    cache: new InMemoryCache({
        dataIdFromObject: () => undefined,
        possibleTypes: possibletypes.possibleTypes,
        typePolicies: {
            Query: {
                fields: {
                    oppgaveFeed: {
                        keyArgs: ['filtrering', 'sortering'],
                        merge(_, incoming) {
                            const incomingOppgaver = incoming.oppgaver;
                            return {
                                oppgaver: incomingOppgaver,
                                totaltAntallOppgaver: incoming.totaltAntallOppgaver,
                            };
                        },
                    },
                },
            },
            OppgaveTilBehandling: { keyFields: ['id'] },
            Notater: { keyFields: ['id'] },
            Notat: { keyFields: ['id'] },
            Kommentar: { keyFields: ['id'] },
            Periode: { keyFields: ['id'] },
            Kommentarer: { keyFields: ['id'] },
            Person: { keyFields: ['fodselsnummer'] },
            VarselDTO: { keyFields: ['generasjonId', 'kode'] },
        },
    }),
});
