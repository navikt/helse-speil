import { NextResponse } from 'next/server';

import { stubEllerVideresendTilSanity } from '@app/api/sanity/stubEllerVideresendTilSanity';
import { InformasjonsmeldingerQueryResult } from '@external/sanity';

export const GET = async () => {
    const response = await stubEllerVideresendTilSanity<InformasjonsmeldingerQueryResult>(
        `*[_type == "informasjonsmelding"]`,
    );
    return NextResponse.json(response.data);
};
