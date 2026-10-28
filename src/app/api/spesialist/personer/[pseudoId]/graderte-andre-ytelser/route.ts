import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const GET = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(() =>
    import('./stub').then((m) => m.getStub),
);

export const POST = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(() =>
    import('./stub').then((m) => m.postStub),
);
