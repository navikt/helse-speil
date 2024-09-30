import { useQuery } from '@apollo/client';
import {
    FetchInntektsmeldingDocument,
    FetchInntektsmeldingQuery,
    FetchSoknadDocument,
    FetchSoknadQuery,
} from '@io/graphql';
import { ApolloResponse } from '@state/oppgaver';

export const useQuerySoknad = (fnr: string, dokumentId: string): ApolloResponse<FetchSoknadQuery['hentSoknad']> => {
    const fetchedSoknad = useQuery(FetchSoknadDocument, {
        variables: {
            fnr: fnr,
            dokumentId: dokumentId,
        },
    });

    return {
        data: fetchedSoknad.data?.hentSoknad,
        error: fetchedSoknad.error,
        loading: fetchedSoknad.loading,
    };
};

export const useQueryInntektsmelding = (
    fnr: string,
    dokumentId: string,
): ApolloResponse<FetchInntektsmeldingQuery['hentInntektsmelding']> => {
    const fetchedInntektsmelding = useQuery(FetchInntektsmeldingDocument, {
        variables: {
            fnr: fnr,
            dokumentId: dokumentId,
        },
    });

    return {
        data: fetchedInntektsmelding.data?.hentInntektsmelding ?? undefined,
        error: fetchedInntektsmelding.error,
        loading: fetchedInntektsmelding.loading,
    };
};
