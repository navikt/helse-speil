import { stubEllerVideresendTilSpesialist } from '@app/api/spesialist/common';

export const PATCH = stubEllerVideresendTilSpesialist<{ tilkommenInntektId: string }>(() =>
    import('./stub').then((m) => m.stub),
);
