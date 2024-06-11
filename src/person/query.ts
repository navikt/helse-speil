import { useParams } from 'next/navigation';

import { useQuery } from '@apollo/client';
import { FetchPersonDocument, PersonFragment } from '@io/graphql';

/**
 * @deprecated Use useFetchPersonQuery instead
 *
 * Vurder om komponenten som bruker denne hooken kan:
 * - få person via props fra parent
 * - bruke useFetchPersonQuery i stedet, og håndtere loading (+error) selv
 */
export const useCurrentPerson = (): PersonFragment => {
    const { data } = useFetchPersonQuery();
    return data?.person as PersonFragment;
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
