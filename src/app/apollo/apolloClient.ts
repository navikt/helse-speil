import { RestLink } from 'apollo-link-rest';

import { erLokal } from '@/env';
import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    InMemoryCacheConfig,
    NormalizedCacheObject,
    TypePolicies,
    from,
} from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { possibleTypes } from '@app/apollo/possibletypes';
import { PersonFragment } from '@io/graphql';

const getTypePolicies = (): TypePolicies => {
    return {
        Query: {
            fields: {
                person: {
                    read: (existing, { args, toReference, readField, cache }) => {
                        if (args?.fnr) {
                            return toReference({
                                __typename: 'Person',
                                fodselsnummer: args.fnr,
                            });
                        }

                        if (args?.aktorId) {
                            if (existing) {
                                // Den ber om det som allerede ligger i cachen på aktorId
                                const fnr = readField<string>('fodselsnummer', existing);
                                if (!fnr) return;
                                return toReference({
                                    __typename: 'Person',
                                    fodselsnummer: fnr,
                                });
                            } else {
                                // Vi må se i cachen om det ligger en person med denne aktørIden, typisk når det bare er fetcha på fnr
                                const values = Object.values(cache.extract());
                                const relevantPerson = values.find(
                                    (it) => it?.__typename === 'Person' && it.aktorId === args.aktorId,
                                ) as PersonFragment | undefined;

                                if (relevantPerson == null) {
                                    return;
                                }

                                return toReference({
                                    __typename: 'Person',
                                    fodselsnummer: relevantPerson?.fodselsnummer,
                                });
                            }
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
        Notat: { keyFields: ['id'] },
        Kommentar: { keyFields: ['id'] },
        LagtPaVent: { keyFields: ['id'] },
        TotrinnsvurderingRetur: { keyFields: ['id'] },
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
    possibleTypes: possibleTypes,
    typePolicies: getTypePolicies(),
};

export const createApolloClient = (): ApolloClient<NormalizedCacheObject> =>
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
