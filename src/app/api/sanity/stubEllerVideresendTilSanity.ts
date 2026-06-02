import { AxiosResponse } from 'axios';

import { ServerEnv, getServerEnv, sanityBaseUrl } from '@/env';
import { customAxios } from '@app/axios/axiosClient';
import { SanityMock } from '@spesialist-mock/storage/sanity';

export const stubEllerVideresendTilSanity = async <T>(query: string): Promise<AxiosResponse<T>> => {
    const dataset = getServerEnv().SANITY_DATASET;
    if (dataset == 'local-mock') return localResponse(query);
    else return sanityResponse(dataset, query);
};

function localResponse<T>(query: string) {
    return {
        data: query.includes(`_id == "forkastingarsaker"]`) ? SanityMock.forkastingarsaker() : '',
        status: 200,
        statusText: 'OK',
        headers: {},
    } as AxiosResponse<T>;
}

function sanityResponse<T>(dataset: ServerEnv['SANITY_DATASET'], query: string) {
    const headers =
        dataset === 'production' ? { Authorization: `Bearer ${getServerEnv().SANITY_READ_DATASETS_TOKEN}` } : {};
    return customAxios.post<T>(
        sanityBaseUrl(),
        { query },
        {
            headers: headers,
            params: { perspective: 'published' },
        },
    );
}
