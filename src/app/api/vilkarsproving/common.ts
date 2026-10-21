import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';
import { videresendTilVilkarsproving } from '@app/api/vilkarsproving/videresender';

export const stubEllerVideresendTilVilkarsproving = lagStubEllerVideresend({
    stubbetFor: ['mock', 'lokal-spesialist', 'lokal-sporhund'],
    videresend: videresendTilVilkarsproving,
});
