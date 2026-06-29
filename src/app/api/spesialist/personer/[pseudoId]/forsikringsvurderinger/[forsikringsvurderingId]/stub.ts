import { NextRequest } from 'next/server';

export async function stub(_request: NextRequest) {
    return Response.json(
        { eksisterer: true, forsikringInnhold: { gjelderFraDag: 17, dekningsgrad: 100 } },
        { status: 200 },
    );
}
