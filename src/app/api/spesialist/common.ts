import { videresendSseTilSpesialist, videresendTilSpesialist } from '@app/api/spesialist/videresender';
import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';

export const stubEllerVideresendTilSpesialist = lagStubEllerVideresend({
    stubbetFor: ['mock', 'lokal-sporhund', 'lokal-vilkarsproving'],
    videresend: videresendTilSpesialist,
});

export const stubEllerVideresendSseTilSpesialist = lagStubEllerVideresend({
    stubbetFor: ['mock', 'lokal-sporhund', 'lokal-vilkarsproving'],
    videresend: videresendSseTilSpesialist,
    forsinkelse: false,
});
