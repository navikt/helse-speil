import { NextResponse } from 'next/server';

import { stubEllerVideresendTilSanity } from '@app/api/sanity/stubEllerVideresendTilSanity';
import { ArsakerQueryResult } from '@external/sanity';

export const GET = async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const response = await stubEllerVideresendTilSanity<ArsakerQueryResult>(`*[_type == "arsaker" && _id == "${id}"]`);
    return NextResponse.json(response.data);
};
