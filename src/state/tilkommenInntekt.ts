import { useParams } from 'next/navigation';

import { QueryResult, useQuery } from '@apollo/client';
import {
    HentTilkommenInntektDocument,
    HentTilkommenInntektQuery,
    HentTilkommenInntektQueryVariables,
} from '@io/graphql';

export const useHentTilkommenInntektQuery = (): QueryResult<
    HentTilkommenInntektQuery,
    HentTilkommenInntektQueryVariables
> => {
    const { aktorId } = useParams<{ aktorId: string }>();

    return useQuery(HentTilkommenInntektDocument, {
        fetchPolicy: 'cache-first',
        variables: {
            aktorId: aktorId,
        },
    });
};
