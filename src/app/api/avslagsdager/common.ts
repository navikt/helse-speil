import { erTilgjengelig } from '@app/api/backends';
import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';
import { lagVideresender } from '@app/api/videresender';

const videresendTilAvslagsdager = lagVideresender('avslagsdager');

// sp-avslagsdager er bare tatt i bruk i dev ennå
export const stubEllerVideresendTilAvslagsdager = lagStubEllerVideresend({
    backend: 'avslagsdager',
    videresend: (request) =>
        erTilgjengelig('avslagsdager')
            ? videresendTilAvslagsdager(request)
            : Promise.resolve(new Response(null, { status: 404 })),
});
