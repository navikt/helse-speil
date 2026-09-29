import { defineQuery } from 'groq';
import { NextResponse } from 'next/server';

import { stubEllerVideresendTilSanity } from '@app/api/sanity/stubEllerVideresendTilSanity';
import { ArsakerQueryResult } from '@io/sanity/generated/sanity.types';

const arsakerQuery = defineQuery(`*[_type == "arsaker" && _id == $id]{
    _id,
    arsaker[] {
        _key,
        arsak
    }
}`);

export const GET = async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const response = await stubEllerVideresendTilSanity<ArsakerQueryResult>(arsakerQuery, { id });
    return NextResponse.json(response.data);
};
