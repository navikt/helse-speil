import { stubEllerVideresendTilVilkarsproving } from '@app/api/vilkarsproving/common';

export const POST = stubEllerVideresendTilVilkarsproving<{ personPseudoId: string }>(() =>
    import('./stub').then((m) => m.stub),
);
