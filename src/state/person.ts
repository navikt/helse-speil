import { useParams } from 'next/navigation';

import { QueryResult, useQuery } from '@apollo/client';
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
