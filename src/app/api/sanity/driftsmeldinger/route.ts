import { defineQuery } from 'groq';
import { NextResponse } from 'next/server';

import { stubEllerVideresendTilSanity } from '@app/api/sanity/stubEllerVideresendTilSanity';
import { DriftsmeldingerQueryResult } from '@io/sanity/generated/sanity.types';

const driftsmeldingerQuery = defineQuery(`*[_type == "driftsmelding"]{
    _id,
    _updatedAt,
    lost,
    iProd,
    iDev,
    statuser[] {
        _key,
        tidspunkt,
        konsekvens,
        arsak,
        tiltak,
        cta,
        oppdatering
    }
}`);

export const GET = async () => {
    const response = await stubEllerVideresendTilSanity<DriftsmeldingerQueryResult>(driftsmeldingerQuery);
    return NextResponse.json(response.data);
};
