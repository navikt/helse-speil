import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

import { deleteStub } from './deleteStub';
import { putStub } from './putStub';

export const PUT = stubEllerVideresendTilSpesialist(putStub);
export const DELETE = stubEllerVideresendTilSpesialist(deleteStub);
