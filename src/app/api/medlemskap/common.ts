import { erTilgjengelig } from '@app/api/backends';
import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';
import { lagVideresender } from '@app/api/videresender';

const videresendTilMedlemskap = lagVideresender('medlemskap');

// sp-medlemskap er bare satt opp i dev ennå
export const stubEllerVideresendTilMedlemskap = lagStubEllerVideresend({
    backend: 'medlemskap',
    videresend: (request) =>
        erTilgjengelig('medlemskap')
            ? videresendTilMedlemskap(request)
            : Promise.resolve(new Response(null, { status: 404 })),
});
