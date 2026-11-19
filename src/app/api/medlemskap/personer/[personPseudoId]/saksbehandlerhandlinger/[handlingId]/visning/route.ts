import { stubEllerVideresendTilMedlemskap } from '@app/api/medlemskap/common';

export const GET = stubEllerVideresendTilMedlemskap<{ personPseudoId: string; handlingId: string }>(() =>
    import('./stub').then((m) => m.stub),
);
