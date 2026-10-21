import { videresendTilSpout } from '@app/api/spout/videresender';
import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';

export const stubEllerVideresendTilSpout = lagStubEllerVideresend({
    stubbetFor: ['mock'],
    videresend: videresendTilSpout,
});
