import { NextResponse } from 'next/server';

import { logger } from '@navikt/next-logger';

import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const POST = stubEllerVideresendTilSpesialist(async () => {
    if (Math.random() > 0.05) {
        return new Response(null, { status: 204 });
    } else {
        logger.info(`Returnerer liksom-feilmelding`);
        return NextResponse.json({ code: 'MANGLER_TILGANG_TIL_PERSON' }, { status: 403 });
    }
});
