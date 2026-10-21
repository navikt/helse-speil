import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const POST = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(() => import('./stub').then((m) => m.stub));
