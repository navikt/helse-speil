import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const POST = stubEllerVideresendTilSpesialist(() => import('./postStub').then((m) => m.postStub));
