import { NextRequest } from 'next/server';

export async function stub(_request: NextRequest, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    return Response.json({ kanVarsles: true, reservert: pseudoId.endsWith('4') });
}
