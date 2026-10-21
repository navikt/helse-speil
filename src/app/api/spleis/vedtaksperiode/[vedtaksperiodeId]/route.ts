import { stubEllerVideresendTilSpleis } from '@app/api/spleis/common';

export const POST = stubEllerVideresendTilSpleis(() => import('./stub').then((m) => m.stub));
