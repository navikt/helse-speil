import { NextResponse } from 'next/server';

import { stubEllerVideresendTilSanity } from '@app/api/sanity/stubEllerVideresendTilSanity';
import { DriftsmeldingerQueryResult } from '@external/sanity';

export const GET = async () => {
    const response = await stubEllerVideresendTilSanity<DriftsmeldingerQueryResult>(`*[_type == "driftsmelding"]`);
    return NextResponse.json(response.data);
};
