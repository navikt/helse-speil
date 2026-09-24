import { NextRequest } from 'next/server';

let antallRevurderinger = 0;

export async function stub(request: NextRequest, params: Promise<{ pseudoId: string }>) {
    await params;
    const { skjæringstidspunkt }: { skjæringstidspunkt: string } = await request.json();

    if (!skjæringstidspunkt) return new Response(null, { status: 400 });

    // Annenhver revurdering gir ny vurdering, slik at begge utfall kan testes lokalt
    antallRevurderinger += 1;
    return Response.json({ nyForsikringsvurdering: antallRevurderinger % 2 === 1 }, { status: 200 });
}
