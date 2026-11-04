import { erTilgjengelig } from '@app/api/backends';
import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';
import { lagVideresender } from '@app/api/videresender';

const videresendTilAndreYtelser = lagVideresender('andre-ytelser');

// sp-andre-ytelser er bare satt opp i dev ennå
export const stubEllerVideresendTilAndreYtelser = lagStubEllerVideresend({
    backend: 'andre-ytelser',
    videresend: (request) =>
        erTilgjengelig('andre-ytelser')
            ? videresendTilAndreYtelser(request)
            : Promise.resolve(new Response(null, { status: 404 })),
});
