import { useEffect, useState } from 'react';

import { ApolloError, useQuery } from '@apollo/client';
import { BehandledeOppgaverFeedDocument, BehandletOppgave } from '@io/graphql';

interface BehandledeOppgaverResponse {
    oppgaver?: BehandletOppgave[];
    error?: ApolloError;
    loading: boolean;
    antallOppgaver: number;
    numberOfPages: number;
    currentPage: number;
    limit: number;
    setPage: (newPage: number) => void;
}

export const useBehandledeOppgaverFeed = (): BehandledeOppgaverResponse => {
    const [offset, setOffset] = useState(0);
    const limit = 14;

    const { data, error, loading, fetchMore } = useQuery(BehandledeOppgaverFeedDocument, {
        variables: {
            offset: 0,
            limit: limit,
        },
        initialFetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        onError: () => {
            throw Error('Kunne ikke hente saker. Prøv igjen senere.');
        },
    });

    useEffect(() => {
        void fetchMore({
            variables: {
                offset,
            },
        });
    }, [offset, fetchMore]);

    const antallOppgaver = data?.behandledeOppgaverFeed.totaltAntallOppgaver ?? 0;
    const numberOfPages = Math.max(Math.ceil(antallOppgaver / limit), 1);
    const currentPage = Math.max(Math.ceil((offset + 1) / limit), 1);

    return {
        oppgaver: data?.behandledeOppgaverFeed.oppgaver,
        error,
        loading,
        antallOppgaver,
        numberOfPages,
        limit,
        currentPage: currentPage > numberOfPages ? 1 : currentPage,
        setPage: (newPage) => {
            setOffset(limit * (newPage - 1));
        },
    };
};
