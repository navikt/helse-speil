import { videresendTilSpoogle } from '@app/api/spoogle/videresender';
import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';

export const stubEllerVideresendTilSpoogle = lagStubEllerVideresend({
    stubbetFor: ['mock'],
    videresend: videresendTilSpoogle,
});
