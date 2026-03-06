import { NextResponse } from 'next/server';

import { videresendTilSanity } from '@app/api/sanity/videresendTilSanity';
import { ArsakerQueryResult } from '@external/sanity';

export const GET = async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const response = await videresendTilSanity<ArsakerQueryResult>(`*[_type == "arsaker" && _id == "${id}"]`);
    return NextResponse.json(response.data);
};
