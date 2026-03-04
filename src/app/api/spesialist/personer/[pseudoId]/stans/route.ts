import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const PATCH = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(async () => Response.json({}));
