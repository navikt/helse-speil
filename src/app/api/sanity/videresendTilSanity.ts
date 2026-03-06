import { AxiosResponse } from 'axios';

import { getServerEnv, sanityBaseUrl } from '@/env';
import { customAxios } from '@app/axios/axiosClient';

export const videresendTilSanity = async <T>(query: string): Promise<AxiosResponse<T>> => {
    const dataset = getServerEnv().SANITY_DATASET;
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
        },
    );
};
