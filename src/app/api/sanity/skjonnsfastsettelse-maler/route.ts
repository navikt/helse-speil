import { NextResponse } from 'next/server';

import { stubEllerVideresendTilSanity } from '@app/api/sanity/stubEllerVideresendTilSanity';
import { SkjønnsfastsettelseMalerQueryResult } from '@external/sanity';

export const GET = async () => {
    const response = await stubEllerVideresendTilSanity<SkjønnsfastsettelseMalerQueryResult>(
        `*[_type == "skjonnsfastsettelseMal"]`,
    );
    return NextResponse.json(response.data);
};
