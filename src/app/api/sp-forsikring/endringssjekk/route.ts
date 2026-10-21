import { stubEllerVideresendTilSpForsikring } from '@app/api/sp-forsikring/common';

export const POST = stubEllerVideresendTilSpForsikring(() => import('./stub').then((m) => m.stub));
