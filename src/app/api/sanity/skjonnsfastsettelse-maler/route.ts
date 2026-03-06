import { NextResponse } from 'next/server';

import { sanityBaseUrl } from '@/env';
import { customAxios } from '@app/axios/axiosClient';
import { SkjønnsfastsettelseMalerQueryResult } from '@external/sanity';

export const GET = async () => {
    const response = await customAxios.post<SkjønnsfastsettelseMalerQueryResult>(sanityBaseUrl(), {
        query: `*[_type == "skjonnsfastsettelseMal"]`,
    });
    return NextResponse.json(response.data);
};
