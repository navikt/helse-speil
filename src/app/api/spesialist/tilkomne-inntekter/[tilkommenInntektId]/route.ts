import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

import { stub } from './stub';

export const PATCH = stubEllerVideresendTilSpesialist<{ tilkommenInntektId: string }>(stub);
