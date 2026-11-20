import { stubEllerVideresendTilSykepengegrunnlag } from '@app/api/sykepengegrunnlag/common';

export const GET = stubEllerVideresendTilSykepengegrunnlag<{ personPseudoId: string }>(() =>
    import('./stub').then((m) => m.stub),
);
