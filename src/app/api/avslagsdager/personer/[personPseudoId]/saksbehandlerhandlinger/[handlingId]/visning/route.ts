import { stubEllerVideresendTilAvslagsdager } from '@app/api/avslagsdager/common';

export const GET = stubEllerVideresendTilAvslagsdager<{ personPseudoId: string; handlingId: string }>(() =>
    import('./stub').then((m) => m.stub),
);
