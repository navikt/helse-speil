import { stubEllerVideresendTilMedlemskap } from '@app/api/medlemskap/common';

export const POST = stubEllerVideresendTilMedlemskap<{ personPseudoId: string }>(() =>
    import('./stub').then((m) => m.stub),
);
