import { NextResponse } from 'next/server';

import { videresendTilSanity } from '@app/api/sanity/videresendTilSanity';
import { DriftsmeldingerQueryResult } from '@external/sanity';

export const GET = async () => {
    const response = await videresendTilSanity<DriftsmeldingerQueryResult>(`*[_type == "driftsmelding"]`);
    return NextResponse.json(response.data);
};
