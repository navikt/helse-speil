import { ApolloClient, InMemoryCache } from '@apollo/client';
import possibletypes from '@io/graphql/generated/possibletypes';

export const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache({
        dataIdFromObject: () => undefined,
        possibleTypes: possibletypes.possibleTypes,
        typePolicies: { OppgaveForOversiktsvisning: { keyFields: ['id'] } },
    }),
});
