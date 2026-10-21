import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';

export const GET = stubEllerVideresendTilSporhund(() => import('./stub').then((m) => m.stub));
