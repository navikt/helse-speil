import { NextResponse } from 'next/server';

import { sanityBaseUrl } from '@/env';
import { customAxios } from '@app/axios/axiosClient';
import { InformasjonsmeldingerQueryResult } from '@external/sanity';

export const GET = async () => {
    const response = await customAxios.post<InformasjonsmeldingerQueryResult>(sanityBaseUrl(), {
        query: `*[_type == "informasjonsmelding"]`,
    });
    return NextResponse.json(response.data);
};
