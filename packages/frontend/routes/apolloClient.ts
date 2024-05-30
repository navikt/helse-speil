import { ApolloClient, HttpLink, InMemoryCache, TypePolicies } from '@apollo/client';
import possibletypes from '@io/graphql/generated/possibletypes';

import { BASE_URL } from '../constants';

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

export const client = new ApolloClient({
    link: new HttpLink({ uri: `${BASE_URL}/graphql` }),
    cache: new InMemoryCache({
        dataIdFromObject: () => undefined,
        possibleTypes: possibletypes.possibleTypes,
        typePolicies: getTypePolicies(),
    }),
});
