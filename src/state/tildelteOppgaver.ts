import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';

import { ApolloError, useQuery } from '@apollo/client';
import { OppgaveTilBehandling, TildelteOppgaverFeedDocument } from '@io/graphql';
import { valgtSaksbehandlerAtom } from '@oversikt/table/state/filter';
import { limit, offset, useCurrentPageState } from '@oversikt/table/state/pagination';
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
    const [currentPage, setCurrentPage] = useCurrentPageState();
    const initialLoad = useRef(true);

    const { data, error, loading, fetchMore } = useQuery(TildelteOppgaverFeedDocument, {
        variables: {
            offset: offset(currentPage),
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

    useEffect(() => {
        if (initialLoad.current) {
            initialLoad.current = false;
            return;
        }
        setCurrentPage(1);
    }, [valgtSaksbehandler, setCurrentPage]);

    return {
        oppgaver: data?.tildelteOppgaverFeed.oppgaver,
        antallOppgaver: data?.tildelteOppgaverFeed.totaltAntallOppgaver ?? 0,
        error,
        loading,
        fetchMore,
    };
};
