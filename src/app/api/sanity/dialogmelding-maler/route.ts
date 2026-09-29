import { defineQuery } from 'groq';
import { NextResponse } from 'next/server';

import { stubEllerVideresendTilSanity } from '@app/api/sanity/stubEllerVideresendTilSanity';
import { DialogmeldingMalerQueryResult } from '@io/sanity/generated/sanity.types';

const dialogmeldingMalerQuery = defineQuery(`*[_type == "dialogmeldingmal"]{
    _id,
    iProd,
    tittel,
    tekst
}`);

export const GET = async () => {
    const response = await stubEllerVideresendTilSanity<DialogmeldingMalerQueryResult>(dialogmeldingMalerQuery);
    return NextResponse.json(response.data);
};
