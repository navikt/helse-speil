import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';
import { stub } from '@app/api/spesialist/liste-oppgaver/stub';

export const dynamic = 'force-dynamic';

export const GET = stubEllerVideresendTilSpesialist(stub);
