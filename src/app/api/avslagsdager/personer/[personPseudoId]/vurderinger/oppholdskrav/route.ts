import { stubEllerVideresendTilAvslagsdager } from '@app/api/avslagsdager/common';

export const POST = stubEllerVideresendTilAvslagsdager<{ personPseudoId: string }>(() =>
    import('./stub').then((m) => m.stub),
);
