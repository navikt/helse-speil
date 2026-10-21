import { videresendTilSporhund } from '@app/api/sporhund/videresender';
import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';

export const stubEllerVideresendTilSporhund = lagStubEllerVideresend({
    stubbetFor: ['mock', 'lokal-spesialist', 'lokal-vilkarsproving'],
    videresend: videresendTilSporhund,
});
