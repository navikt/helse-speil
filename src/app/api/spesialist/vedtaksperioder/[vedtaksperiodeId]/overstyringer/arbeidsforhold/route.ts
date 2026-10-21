import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const POST = stubEllerVideresendTilSpesialist<{ vedtaksperiodeId: string }>(() =>
    import('./stub').then((m) => m.stub),
);
