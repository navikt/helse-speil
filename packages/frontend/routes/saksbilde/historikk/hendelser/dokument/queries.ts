import { useQuery } from '@apollo/client';
import { FetchSoknadDocument, Soknad } from '@io/graphql';
import { ApolloResponse } from '@state/oppgaver';

export const useQuerySoknad = (fnr: string, dokumentId: string): ApolloResponse<Soknad> => {
    const fetchSoknad = useQuery(FetchSoknadDocument, {
        variables: {
            fnr: fnr,
            dokumentId: dokumentId,
        },
    });

    return {
        data: fetchSoknad.data?.hentSoknad,
        error: fetchSoknad.error,
        loading: fetchSoknad.loading,
    };
};
