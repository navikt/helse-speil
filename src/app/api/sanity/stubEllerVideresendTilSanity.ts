import { ServerEnv, getServerEnv, sanityBaseUrl } from '@/env';
import { postJson } from '@app/fetch/fetchClient';
import { SanityMock } from '@spesialist-mock/storage/sanity';

type SanityParams = Record<string, string>;
type SanityResponse<T> = { data: T };

export const stubEllerVideresendTilSanity = async <T>(
    query: string,
    params?: SanityParams,
): Promise<SanityResponse<T>> => {
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

    return { data } as SanityResponse<T>;
}

async function sanityResponse<T>(dataset: ServerEnv['SANITY_DATASET'], query: string, params?: SanityParams) {
    const headers: Record<string, string> =
        dataset === 'production' ? { Authorization: `Bearer ${getServerEnv().SANITY_READ_DATASETS_TOKEN}` } : {};
    const data = await postJson<T>(`${sanityBaseUrl()}?perspective=published`, { query, params }, { headers });
    return { data };
}
