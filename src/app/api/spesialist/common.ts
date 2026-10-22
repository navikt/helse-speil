import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';
import { lagVideresender } from '@app/api/videresender';

export const videresendTilSpesialist = lagVideresender('spesialist');

export const stubEllerVideresendTilSpesialist = lagStubEllerVideresend({ backend: 'spesialist' });

export const stubEllerVideresendSseTilSpesialist = lagStubEllerVideresend({
    backend: 'spesialist',
    forsinkelse: false,
});
