import { type ErrorType, callCustomAxios } from '@app/axios/orval-mutator';
import {
    type MutationFunction,
    type QueryClient,
    type UseMutationOptions,
    type UseMutationResult,
    useMutation,
} from '@tanstack/react-query';

export type ApiSjekkEndringForsikringRequest = {
    identitetsnummer: string;
    skjæringstidspunkt: string;
};

export type ApiSjekkEndringForsikringResponse = {
    vurderingErEndret: boolean;
};

const postSjekkEndringForsikring = (apiEndringssjekkRequest?: ApiSjekkEndringForsikringRequest, signal?: AbortSignal) =>
    callCustomAxios<ApiSjekkEndringForsikringResponse>({
        url: `/api/sp-forsikring/endringssjekk`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: apiEndringssjekkRequest,
        signal,
    });

export const usePostSjekkEndringForsikring = <TError = ErrorType<ForsikringApiProblemResponse>, TContext = unknown>(
    options?: {
        mutation?: UseMutationOptions<
            Awaited<ReturnType<typeof postSjekkEndringForsikring>>,
            TError,
            { data: ApiSjekkEndringForsikringRequest },
            TContext
        >;
    },
    queryClient?: QueryClient,
): UseMutationResult<
    Awaited<ReturnType<typeof postSjekkEndringForsikring>>,
    TError,
    { data: ApiSjekkEndringForsikringRequest },
    TContext
> => {
    const mutationOptions = getPostSjekkEndringForsikringMutationOptions(options);

    return useMutation(mutationOptions, queryClient);
};

export const getPostSjekkEndringForsikringMutationOptions = <
    TError = ErrorType<ForsikringApiProblemResponse>,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postSjekkEndringForsikring>>,
        TError,
        { data: ApiSjekkEndringForsikringRequest },
        TContext
    >;
}): UseMutationOptions<
    Awaited<ReturnType<typeof postSjekkEndringForsikring>>,
    TError,
    { data: ApiSjekkEndringForsikringRequest },
    TContext
> => {
    const mutationKey = ['postSjekkEndringForsikring'];
    const { mutation: mutationOptions } = options
        ? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey
            ? options
            : { ...options, mutation: { ...options.mutation, mutationKey } }
        : { mutation: { mutationKey } };

    const mutationFn: MutationFunction<
        Awaited<ReturnType<typeof postSjekkEndringForsikring>>,
        { data: ApiSjekkEndringForsikringRequest }
    > = (props) => {
        const { data } = props ?? {};

        return postSjekkEndringForsikring(data);
    };

    return { mutationFn, ...mutationOptions };
};

export interface ForsikringApiProblemResponse {
    type: string;
    status: number;
    title: string;
    detail: string;
    instance: string;
}
