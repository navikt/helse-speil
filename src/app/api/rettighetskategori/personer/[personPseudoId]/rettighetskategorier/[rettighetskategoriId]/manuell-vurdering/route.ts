import { stubEllerVideresendTilRettighetskategori } from '@app/api/rettighetskategori/common';

export const POST = stubEllerVideresendTilRettighetskategori<{
    personPseudoId: string;
    rettighetskategoriId: string;
}>(() => import('./stub').then((m) => m.stub));
