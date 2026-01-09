import { NextRequest } from 'next/server';

export async function stub(_request: NextRequest, _: Promise<{ pseudoId: string }>) {
    return Response.json([]);
}
