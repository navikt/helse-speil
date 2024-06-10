import { useParams } from 'next/navigation';

import { useApolloClient, useQuery } from '@apollo/client';
import { FetchPersonDocument } from '@io/graphql';

export const useCurrentPerson = (): FetchedPerson => {
    const { data } = useFetchPersonQuery();
    return data?.person as FetchedPerson;
};

export const useFetchPersonQuery = () => {
    const client = useApolloClient();
    const { aktorId } = useParams<{ aktorId?: string }>();

    return useQuery(FetchPersonDocument, {
        fetchPolicy: 'cache-first',
        variables: {
            aktorId: aktorId,
        },
        skip: !aktorId,
        onCompleted: (data) => {
            const fnr = data.person?.fodselsnummer;

            client.writeQuery({
                query: FetchPersonDocument,
                variables: { fnr },
                data,
            });
        },
    });
};
