import { ApolloClient, InMemoryCache } from '@apollo/client';
import possibletypes from '@io/graphql/generated/possibletypes';

const baseUrlGraphQL = (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '') + '/graphql';
export const client = new ApolloClient({
    uri: baseUrlGraphQL,
    cache: new InMemoryCache({
        dataIdFromObject: () => undefined,
        possibleTypes: possibletypes.possibleTypes,
        typePolicies: {
            OppgaveForOversiktsvisning: { keyFields: ['id'] },
            Notater: { keyFields: ['id'] },
            Notat: { keyFields: ['id'] },
            Kommentarer: { keyFields: ['id'] },
        },
    }),
});
