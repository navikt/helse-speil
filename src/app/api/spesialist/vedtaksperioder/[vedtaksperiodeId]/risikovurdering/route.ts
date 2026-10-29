import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const GET = stubEllerVideresendTilSpesialist(() => import('./stub').then((m) => m.stub));
