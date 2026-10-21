import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const PUT = stubEllerVideresendTilSpesialist(() => import('./putStub').then((m) => m.putStub));
export const DELETE = stubEllerVideresendTilSpesialist(() => import('./deleteStub').then((m) => m.deleteStub));
