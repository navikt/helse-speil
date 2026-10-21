import { stubEllerVideresendTilSparsom } from '@app/api/sparsom/common';

export const POST = stubEllerVideresendTilSparsom(() => import('./stub').then((m) => m.stub));
