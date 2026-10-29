import { stubEllerVideresendTilRettighetskategori } from '@app/api/rettighetskategori/common';

export const GET = stubEllerVideresendTilRettighetskategori<{ personPseudoId: string; rettighetskategoriId: string }>(
    () => import('./stub').then((m) => m.stub),
);
