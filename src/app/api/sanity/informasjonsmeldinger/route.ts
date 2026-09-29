import { defineQuery } from 'groq';
import { NextResponse } from 'next/server';

import { stubEllerVideresendTilSanity } from '@app/api/sanity/stubEllerVideresendTilSanity';
import { InformasjonsmeldingerQueryResult } from '@io/sanity/generated/sanity.types';

const informasjonsmeldingerQuery = defineQuery(`*[_type == "informasjonsmelding"]{
    _id,
    _updatedAt,
    tittel,
    beskrivelse,
    synligTil,
    iProd,
    iDev
}`);

export const GET = async () => {
    const response = await stubEllerVideresendTilSanity<InformasjonsmeldingerQueryResult>(informasjonsmeldingerQuery);
    return NextResponse.json(response.data);
};
