import { stubEllerVideresendTilVilkarsproving } from '@app/api/vilkarsproving/common';

export const GET = stubEllerVideresendTilVilkarsproving<{ personPseudoId: string }>(() =>
    import('./stub').then((m) => m.stub),
);
