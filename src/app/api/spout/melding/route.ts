import { stubEllerVideresendTilSpout } from '@app/api/spout/common';

export const POST = stubEllerVideresendTilSpout(() => import('./stub').then((m) => m.stub));
