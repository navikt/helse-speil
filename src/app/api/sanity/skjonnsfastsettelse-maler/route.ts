import { NextResponse } from 'next/server';

import { videresendTilSanity } from '@app/api/sanity/videresendTilSanity';
import { SkjønnsfastsettelseMalerQueryResult } from '@external/sanity';

export const GET = async () => {
    const response = await videresendTilSanity<SkjønnsfastsettelseMalerQueryResult>(
        `*[_type == "skjonnsfastsettelseMal"]`,
    );
    return NextResponse.json(response.data);
};
