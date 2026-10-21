import { stubEllerVideresendTilSpleis } from '@app/api/spleis/common';

export const GET = stubEllerVideresendTilSpleis(() => import('./stub').then((m) => m.stub));
