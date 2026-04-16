import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';
import { getStub, patchStub } from '@app/api/spesialist/personer/[pseudoId]/stans/saksbehandler/stub';

export const PATCH = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(patchStub);
export const GET = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(getStub);
