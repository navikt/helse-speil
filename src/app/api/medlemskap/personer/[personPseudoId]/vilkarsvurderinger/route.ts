import { stubEllerVideresendTilMedlemskap } from '@app/api/medlemskap/common';

export const GET = stubEllerVideresendTilMedlemskap<{ personPseudoId: string }>(() =>
    import('./stub').then((m) => m.stub),
);
