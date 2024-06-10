import { useParams } from 'next/navigation';

import { useQuery } from '@apollo/client';
import { FetchPersonDocument } from '@io/graphql';

export const useCurrentPerson = (): FetchedPerson => {
    const { data } = useFetchPersonQuery();
    return data?.person as FetchedPerson;
};

export const useFetchPersonQuery = () => {
    const { aktorId } = useParams<{ aktorId?: string }>();

    return useQuery(FetchPersonDocument, {
        fetchPolicy: 'cache-first',
        variables: {
            aktorId: aktorId,
        },
        skip: !aktorId,
    });
};
