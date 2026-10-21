import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';

export const GET = stubEllerVideresendTilSporhund(() => import('./stub').then((m) => m.getStub));
export const POST = stubEllerVideresendTilSporhund(() => import('./stub').then((m) => m.postStub));
export const PATCH = stubEllerVideresendTilSporhund(() => import('./stub').then((m) => m.patchStub));
