import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

import { deleteStub } from './deleteStub';
import { putStub } from './putStub';

export const dynamic = 'force-dynamic';

export const PUT = stubEllerVideresendTilSpesialist(putStub);
export const DELETE = stubEllerVideresendTilSpesialist(deleteStub);
