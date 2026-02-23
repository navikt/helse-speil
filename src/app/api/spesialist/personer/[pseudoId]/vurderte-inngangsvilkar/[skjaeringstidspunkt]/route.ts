import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

import { stub } from './stub';

type Params = { pseudoId: string; skjaeringstidspunkt: string };

export const GET = stubEllerVideresendTilSpesialist<Params>(stub);
export const POST = stubEllerVideresendTilSpesialist<Params>(stub);
