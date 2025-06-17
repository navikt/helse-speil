import dayjs, { Dayjs } from 'dayjs';

import { ApolloError, useQuery } from '@apollo/client';
import { BehandledeOppgaverFeedDocument, BehandletOppgave } from '@io/graphql';
import { limit } from '@oversikt/table/state/pagination';
import { FetchMoreArgs } from '@state/oppgaver';
import { ISO_DATOFORMAT } from '@utils/date';

interface BehandledeOppgaverResponse {
    oppgaver?: BehandletOppgave[];
    error?: ApolloError;
    loading: boolean;
    antallOppgaver: number;
    fetchMore: ({ variables }: FetchMoreArgs) => void;
    refetch: (fom: Dayjs, tom: Dayjs) => void;
}

export const useBehandledeOppgaverFeed = (): BehandledeOppgaverResponse => {
    const { data, error, loading, fetchMore, refetch, previousData } = useQuery(BehandledeOppgaverFeedDocument, {
        variables: {
            offset: 0,
            limit,
            fom: dayjs().format(ISO_DATOFORMAT),
            tom: dayjs().format(ISO_DATOFORMAT),
        },
        notifyOnNetworkStatusChange: true,
        initialFetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
    });

    return {
        oppgaver: data?.behandledeOppgaverFeed.oppgaver ?? previousData?.behandledeOppgaverFeed.oppgaver,
        antallOppgaver:
            data?.behandledeOppgaverFeed.totaltAntallOppgaver ??
            previousData?.behandledeOppgaverFeed.totaltAntallOppgaver ??
            0,
        error,
        loading,
        fetchMore,
        refetch: (fom, tom) => refetch({ fom: fom.format(ISO_DATOFORMAT), tom: tom.format(ISO_DATOFORMAT) }),
    };
};
