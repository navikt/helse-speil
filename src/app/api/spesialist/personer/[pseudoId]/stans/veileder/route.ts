import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';
import { getStub, patchStub } from '@app/api/spesialist/personer/[pseudoId]/stans/veileder/stub';

export const GET = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(getStub);
export const PATCH = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(patchStub);
