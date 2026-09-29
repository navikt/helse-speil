import { AxiosResponse } from 'axios';

import { ServerEnv, getServerEnv, sanityBaseUrl } from '@/env';
import { customAxios } from '@app/axios/axiosClient';
import { SanityMock } from '@spesialist-mock/storage/sanity';

type SanityParams = Record<string, string>;

export const stubEllerVideresendTilSanity = async <T>(
    query: string,
    params?: SanityParams,
): Promise<AxiosResponse<T>> => {
    const dataset = getServerEnv().SANITY_DATASET;
    if (dataset == 'local-mock') return localResponse(params);
    else return sanityResponse(dataset, query, params);
};

function localResponse<T>(params?: SanityParams) {
    const handlers = [
        ['forkastingarsaker', () => SanityMock.forkastingarsaker()],
        ['paventarsaker', () => SanityMock.paventarsaker()],
    ] as const;

    const data = handlers.find(([id]) => params?.id === id)?.[1]() ?? '';

    return {
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
    } as AxiosResponse<T>;
}

function sanityResponse<T>(dataset: ServerEnv['SANITY_DATASET'], query: string, params?: SanityParams) {
    const headers =
        dataset === 'production' ? { Authorization: `Bearer ${getServerEnv().SANITY_READ_DATASETS_TOKEN}` } : {};
    return customAxios.post<T>(
        sanityBaseUrl(),
        { query, params },
        {
            headers: headers,
            params: { perspective: 'published' },
        },
    );
}
