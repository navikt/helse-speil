import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const GET = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(() =>
    import('./stub').then((m) => m.getStub),
);
export const PATCH = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(() =>
    import('./stub').then((m) => m.patchStub),
);
