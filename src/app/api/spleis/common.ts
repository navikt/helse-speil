import { videresendTilSpleis } from '@app/api/spleis/videresender';
import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';

export const stubEllerVideresendTilSpleis = lagStubEllerVideresend({
    stubbetFor: ['mock'],
    videresend: videresendTilSpleis,
});
