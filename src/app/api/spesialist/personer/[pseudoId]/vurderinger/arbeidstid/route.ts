import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

import { stub } from './stub';

export const POST = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(stub);
