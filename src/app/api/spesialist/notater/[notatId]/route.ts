import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';
import { getStub, patchStub } from '@app/api/spesialist/notater/[notatId]/stub';

export const GET = stubEllerVideresendTilSpesialist(getStub);
export const PATCH = stubEllerVideresendTilSpesialist(patchStub);
