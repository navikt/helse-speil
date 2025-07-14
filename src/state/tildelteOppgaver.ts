import { useAtom } from 'jotai';

import { ApolloError, useQuery } from '@apollo/client';
import { OppgaveTilBehandling, TildelteOppgaverFeedDocument } from '@io/graphql';
import { valgtSaksbehandlerAtom } from '@oversikt/table/state/filter';
import { limit } from '@oversikt/table/state/pagination';
import { FetchMoreArgs } from '@state/oppgaver';

interface TildelteOppgaverResponse {
    oppgaver?: OppgaveTilBehandling[];
    error?: ApolloError;
    loading: boolean;
    antallOppgaver: number;
    fetchMore: ({ variables }: FetchMoreArgs) => void;
}

export const useTildelteOppgaverFeed = (): TildelteOppgaverResponse => {
    const [valgtSaksbehandler] = useAtom(valgtSaksbehandlerAtom);

    const { data, error, loading, fetchMore, previousData } = useQuery(TildelteOppgaverFeedDocument, {
        variables: {
            offset: 0,
            limit: limit,
            oppslattSaksbehandler: {
                ident: valgtSaksbehandler?.ident,
                navn: valgtSaksbehandler?.navn || '',
            },
        },
        notifyOnNetworkStatusChange: true,
        initialFetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
    });

    return {
        oppgaver: data?.tildelteOppgaverFeed.oppgaver ?? previousData?.tildelteOppgaverFeed.oppgaver,
        antallOppgaver:
            data?.tildelteOppgaverFeed.totaltAntallOppgaver ??
            previousData?.tildelteOppgaverFeed.totaltAntallOppgaver ??
            0,
        error,
        loading,
        fetchMore,
    };
};
