import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';
import { stub } from '@app/api/spesialist/personer/[pseudoId]/stans/veileder/stub';

export const PATCH = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(stub);
