import { useQuery } from '@apollo/client';
import { DokumentInntektsmelding, FetchInntektsmeldingDocument, FetchSoknadDocument, Soknad } from '@io/graphql';
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

export const useQueryInntektsmelding = (fnr: string, dokumentId: string): ApolloResponse<DokumentInntektsmelding> => {
    const fetchSoknad = useQuery(FetchInntektsmeldingDocument, {
        variables: {
            fnr: fnr,
            dokumentId: dokumentId,
        },
    });

    return {
        data: fetchSoknad.data?.hentInntektsmelding ?? undefined,
        error: fetchSoknad.error,
        loading: fetchSoknad.loading,
    };
};
