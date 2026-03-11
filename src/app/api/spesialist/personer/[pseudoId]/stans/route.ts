import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';
import { stub } from '@app/api/spesialist/personer/[pseudoId]/stans/stub';

export const PATCH = stubEllerVideresendTilSpesialist<{ pseudoId: string }>(stub);
