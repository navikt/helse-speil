import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';

export const POST = stubEllerVideresendTilSporhund(() => import('./stub').then((m) => m.stub));
