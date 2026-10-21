import { stubEllerVideresendTilSpoogle } from '@app/api/spoogle/common';

export const GET = stubEllerVideresendTilSpoogle(() => import('./stub').then((m) => m.stub));
