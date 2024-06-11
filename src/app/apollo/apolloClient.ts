import { RestLink } from 'apollo-link-rest';

import possibletypes from '@/app/apollo/possibletypes';
import { erLokal } from '@/env';
import { ApolloClient, HttpLink, InMemoryCache, InMemoryCacheConfig, TypePolicies, from } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';

const getTypePolicies = (): TypePolicies => {
    return {
        Query: {
            fields: {
                person: {
                    read: (existing, { args, toReference, readField }) => {
                        if (args?.fnr) {
                            return toReference({
                                __typename: 'Person',
                                fodselsnummer: args.fnr,
                            });
                        }

                        if (args?.aktorId && existing) {
                            const fnr = readField<string>('fodselsnummer', existing);
                            if (!fnr) return;

                            return toReference({
                                __typename: 'Person',
                                fodselsnummer: fnr,
                            });
                        }
                    },
                },
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
        Person: { keyFields: ['fodselsnummer'], merge: false },
        VarselDTO: { keyFields: ['generasjonId', 'kode'] },
        SoknadArbeidsgiver: { keyFields: ['id'] },
        SoknadNav: { keyFields: ['id'] },
        Inntektsmelding: { keyFields: ['id'] },
        Utbetaling: { keyFields: ['id'] },
        UberegnetPeriode: { keyFields: ['behandlingId'] },
        BeregnetPeriode: { keyFields: ['behandlingId'] },
    };
};

export const restLink = new RestLink({
    uri: '/',
    endpoints: {
        sanity: 'https://z9kr8ddn.api.sanity.io/v2023-08-01/data/query/production',
        flexjar: '/api/flexjar',
    },
});

export const apolloCacheConfig: InMemoryCacheConfig = {
    dataIdFromObject: () => undefined,
    possibleTypes: possibletypes.possibleTypes,
    typePolicies: getTypePolicies(),
};

export const createApolloClient = () =>
    new ApolloClient({
        link: from([
            restLink,
            new RetryLink({
                attempts: { max: 5 },
            }),
            new HttpLink({ uri: erLokal ? '/api/spesialist' : `/api/graphql` }),
        ]),
        cache: new InMemoryCache(apolloCacheConfig),
    });
