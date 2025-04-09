import dayjs from 'dayjs';

import { ApolloError, useQuery } from '@apollo/client';
import { BehandledeOppgaverFeedDocument, BehandletOppgave } from '@io/graphql';
import { limit, offset, useCurrentPageValue } from '@oversikt/table/state/pagination';
import { FetchMoreArgs } from '@state/oppgaver';
import { ISO_DATOFORMAT } from '@utils/date';

interface BehandledeOppgaverResponse {
    oppgaver?: BehandletOppgave[];
    error?: ApolloError;
    loading: boolean;
    antallOppgaver: number;
    fetchMore: ({ variables }: FetchMoreArgs) => void;
}

export const useBehandledeOppgaverFeed = (): BehandledeOppgaverResponse => {
    const currentPage = useCurrentPageValue();

    const { data, error, loading, fetchMore } = useQuery(BehandledeOppgaverFeedDocument, {
        variables: {
            offset: offset(currentPage),
            limit: limit,
            fom: dayjs().format(ISO_DATOFORMAT),
            tom: dayjs().format(ISO_DATOFORMAT),
        },
        notifyOnNetworkStatusChange: true,
        initialFetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        onError: () => {
            throw Error('Kunne ikke hente saker. Prøv igjen senere.');
        },
    });

    return {
        oppgaver: data?.behandledeOppgaverFeedV2.oppgaver,
        antallOppgaver: data?.behandledeOppgaverFeedV2.totaltAntallOppgaver ?? 0,
        error,
        loading,
        fetchMore,
    };
};
