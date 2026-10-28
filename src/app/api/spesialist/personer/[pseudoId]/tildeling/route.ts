import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const GET = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(() =>
    import('./getStub').then((m) => m.getStub),
);
export const PUT = stubEllerVideresendTilSpesialist(() => import('./putStub').then((m) => m.putStub));
export const DELETE = stubEllerVideresendTilSpesialist(() => import('./deleteStub').then((m) => m.deleteStub));
