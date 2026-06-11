import { NextResponse } from 'next/server';

import { stubEllerVideresendTilSanity } from '@app/api/sanity/stubEllerVideresendTilSanity';
import { DialogmeldingMalerQueryResult } from '@external/sanity';

export const GET = async () => {
    const response =
        await stubEllerVideresendTilSanity<DialogmeldingMalerQueryResult>(`*[_type == "dialogmeldingmal"]`);
    return NextResponse.json(response.data);
};
