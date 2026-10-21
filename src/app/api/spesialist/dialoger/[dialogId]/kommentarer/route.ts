import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const POST = stubEllerVideresendTilSpesialist(() => import('./stub').then((m) => m.stub));
