import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const PATCH = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(() =>
    import('./stub').then((m) => m.patchStub),
);
export const GET = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(() =>
    import('./stub').then((m) => m.getStub),
);
