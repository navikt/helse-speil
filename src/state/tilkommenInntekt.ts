import { QueryResult, useQuery } from '@apollo/client';
import {
    HentTilkommenInntektV2Document,
    HentTilkommenInntektV2Query,
    HentTilkommenInntektV2QueryVariables,
} from '@io/graphql';

export const useHentTilkommenInntektQuery = (
    fødselsnummer?: string,
): QueryResult<HentTilkommenInntektV2Query, HentTilkommenInntektV2QueryVariables> => {
    return useQuery(HentTilkommenInntektV2Document, {
        fetchPolicy: 'cache-first',
        variables: {
            fodselsnummer: fødselsnummer!,
        },
        skip: !fødselsnummer,
    });
};
