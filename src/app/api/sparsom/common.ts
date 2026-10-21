import { videresendTilSparsom } from '@app/api/sparsom/videresender';
import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';

export const stubEllerVideresendTilSparsom = lagStubEllerVideresend({
    stubbetFor: ['mock'],
    videresend: videresendTilSparsom,
});
