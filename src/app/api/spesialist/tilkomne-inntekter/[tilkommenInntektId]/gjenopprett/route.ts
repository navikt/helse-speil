import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

import { stub } from './stub';

export const POST = stubEllerVideresendTilSpesialist<{ tilkommenInntektId: string }>(stub);
