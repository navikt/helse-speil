import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const PATCH = stubEllerVideresendTilSpesialist(() => import('./stub').then((m) => m.stub));
