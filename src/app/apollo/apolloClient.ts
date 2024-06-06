import { RestLink } from 'apollo-link-rest';

import possibletypes from '@/app/apollo/possibletypes';
import { erLokal } from '@/env';
import { ApolloClient, HttpLink, InMemoryCache, TypePolicies, from } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';

const getTypePolicies = (): TypePolicies => {
    return {
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
                behandledeOppgaverFeed: {
                    keyArgs: [],
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
        BehandletOppgave: { keyFields: ['id'] },
        Notater: { keyFields: ['id'] },
        Notat: { keyFields: ['id'] },
        Kommentar: { keyFields: ['id'] },
        Periode: { keyFields: ['id'] },
        Kommentarer: { keyFields: ['id'] },
        Person: { keyFields: ['fodselsnummer'] },
        VarselDTO: { keyFields: ['generasjonId', 'kode'] },
        SoknadArbeidsgiver: { keyFields: ['id'] },
        SoknadNav: { keyFields: ['id'] },
        Inntektsmelding: { keyFields: ['id'] },
        Utbetaling: { keyFields: ['id'] },
        UberegnetPeriode: { keyFields: ['behandlingId'] },
        BeregnetPeriode: { keyFields: ['behandlingId'] },
    };
};

const restLink = new RestLink({
    endpoints: {
        sanity: 'https://z9kr8ddn.api.sanity.io/v2023-08-01/data/query/production',
        flexjar: '/api/flexjar',
    },
});

export const createApolloClient = () =>
    new ApolloClient({
        link: from([
            restLink,
            new RetryLink({
                attempts: { max: 5 },
            }),
            new HttpLink({ uri: erLokal ? '/api/spesialist' : `/api/graphql` }),
        ]),
        cache: new InMemoryCache({
            dataIdFromObject: () => undefined,
            possibleTypes: possibletypes.possibleTypes,
            typePolicies: getTypePolicies(),
        }),
    });
