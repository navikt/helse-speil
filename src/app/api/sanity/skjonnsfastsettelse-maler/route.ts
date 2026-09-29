import { defineQuery } from 'groq';
import { NextResponse } from 'next/server';

import { stubEllerVideresendTilSanity } from '@app/api/sanity/stubEllerVideresendTilSanity';
import { SkjonnsfastsettelseMalerQueryResult } from '@io/sanity/generated/sanity.types';

const skjonnsfastsettelseMalerQuery = defineQuery(`*[_type == "skjonnsfastsettelseMal"]{
    _id,
    iProd,
    arsak,
    begrunnelse,
    konklusjon,
    arbeidsforholdMal,
    lovhjemmel
}`);

export const GET = async () => {
    const response =
        await stubEllerVideresendTilSanity<SkjonnsfastsettelseMalerQueryResult>(skjonnsfastsettelseMalerQuery);
    return NextResponse.json(response.data);
};
