import { NextResponse } from 'next/server';

import { videresendTilSanity } from '@app/api/sanity/videresendTilSanity';
import { InformasjonsmeldingerQueryResult } from '@external/sanity';

export const GET = async () => {
    const response = await videresendTilSanity<InformasjonsmeldingerQueryResult>(`*[_type == "informasjonsmelding"]`);
    return NextResponse.json(response.data);
};
