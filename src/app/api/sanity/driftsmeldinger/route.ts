import { NextResponse } from 'next/server';

import { sanityBaseUrl } from '@/env';
import { customAxios } from '@app/axios/axiosClient';
import { DriftsmeldingerQueryResult } from '@external/sanity';

export const GET = async () => {
    const response = await customAxios.post<DriftsmeldingerQueryResult>(sanityBaseUrl(), {
        query: `*[_type == "driftsmelding"]`,
    });
    return NextResponse.json(response.data);
};
