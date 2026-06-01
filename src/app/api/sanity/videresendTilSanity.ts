import { AxiosResponse } from 'axios';

import { getServerEnv, sanityBaseUrl } from '@/env';
import { customAxios } from '@app/axios/axiosClient';
import { SanityMock } from '@spesialist-mock/storage/sanity';

export const videresendTilSanity = async <T>(query: string): Promise<AxiosResponse<T>> => {
    const dataset = getServerEnv().SANITY_DATASET;

    // Dette gjør at man ikke kan kalle lokal spalten, det er bare å skrive om :-)
    if (dataset == 'local-mock')
        return {
            data: query.includes(`_id == "forkastingarsaker"]`) ? SanityMock.forkastingarsaker() : '',
            status: 200,
            statusText: 'OK',
            headers: {},
        } as AxiosResponse<T>;

    const headers =
        dataset === 'production'
            ? {
                  Authorization: `Bearer ${getServerEnv().SANITY_READ_DATASETS_TOKEN}`,
              }
            : {};
    return customAxios.post<T>(
        sanityBaseUrl(),
        { query },
        {
            headers: headers,
            params: {
                perspective: 'published',
            },
        },
    );
};
