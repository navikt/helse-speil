import { ApolloError, useQuery } from '@apollo/client';
import { BehandledeOppgaverFeedDocument, BehandletOppgave } from '@io/graphql';
import { limit, offset, useCurrentPageValue } from '@oversikt/table/state/pagination';
import { FetchMoreArgs } from '@state/oppgaver';

interface BehandledeOppgaverResponse {
    oppgaver?: BehandletOppgave[];
    error?: ApolloError;
    loading: boolean;
    antallOppgaver: number;
    fetchMore: ({ variables }: FetchMoreArgs) => void;
    refetch: (fom?: string, tom?: string) => void;
}

export const useBehandledeOppgaverFeed = (fom: string, tom: string): BehandledeOppgaverResponse => {
    const currentPage = useCurrentPageValue();

    const { data, error, loading, fetchMore, refetch, previousData } = useQuery(BehandledeOppgaverFeedDocument, {
        variables: {
            offset: offset(currentPage),
            limit: limit,
            fom: fom,
            tom: tom,
        },
        notifyOnNetworkStatusChange: true,
        initialFetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        onError: () => {
            throw Error('Kunne ikke hente saker. Prøv igjen senere.');
        },
    });

    return {
        oppgaver: data?.behandledeOppgaverFeedV2.oppgaver ?? previousData?.behandledeOppgaverFeedV2.oppgaver,
        antallOppgaver:
            data?.behandledeOppgaverFeedV2.totaltAntallOppgaver ??
            previousData?.behandledeOppgaverFeedV2.totaltAntallOppgaver ??
            0,
        error,
        loading,
        fetchMore,
        refetch: (fom, tom) => refetch({ fom, tom }),
    };
};
