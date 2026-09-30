import { useParams } from 'next/navigation';

import { NetworkStatus, QueryResult, useQuery } from '@apollo/client';
import { FetchPersonDocument, FetchPersonQuery, FetchPersonQueryVariables } from '@io/graphql';

export const useFetchPersonQuery = (): QueryResult<FetchPersonQuery, FetchPersonQueryVariables> => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();

    return useQuery(FetchPersonDocument, {
        fetchPolicy: 'cache-first',
        variables: {
            personPseudoId: personPseudoId!,
        },
        skip: !personPseudoId,
    });
};

export function useErPersonUnderLasting(): boolean {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();

    const { networkStatus } = useQuery(FetchPersonDocument, {
        fetchPolicy: 'cache-first',
        variables: {
            personPseudoId: personPseudoId!,
        },
        skip: !personPseudoId,
        notifyOnNetworkStatusChange: true,
    });
    return networkStatus === NetworkStatus.loading || networkStatus === NetworkStatus.refetch;
}
