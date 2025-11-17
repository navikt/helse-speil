import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';
import { deleteStub } from '@app/api/spesialist/varsler/[varselId]/vurdering/deleteStub';
import { putStub } from '@app/api/spesialist/varsler/[varselId]/vurdering/putStub';

export const PUT = stubEllerVideresendTilSpesialist(putStub);
export const DELETE = stubEllerVideresendTilSpesialist(deleteStub);
