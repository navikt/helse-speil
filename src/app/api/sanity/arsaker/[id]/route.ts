import { NextResponse } from 'next/server';

import { sanityBaseUrl } from '@/env';
import { customAxios } from '@app/axios/axiosClient';
import { ArsakerQueryResult } from '@external/sanity';

export const GET = async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const response = await customAxios.post<ArsakerQueryResult>(sanityBaseUrl(), {
        query: `*[_type == "arsaker" && _id == "${id}"]`,
    });
    return NextResponse.json(response.data);
};
