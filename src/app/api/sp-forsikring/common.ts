import { videresendTilSpForsikring } from '@app/api/sp-forsikring/videresender';
import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';

export const stubEllerVideresendTilSpForsikring = lagStubEllerVideresend({
    stubbetFor: ['mock'],
    videresend: videresendTilSpForsikring,
});
