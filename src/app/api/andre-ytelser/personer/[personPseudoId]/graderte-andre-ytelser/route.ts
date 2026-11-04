import { stubEllerVideresendTilAndreYtelser } from '@app/api/andre-ytelser/common';

export const GET = stubEllerVideresendTilAndreYtelser<{ personPseudoId: string }>(() =>
    import('./stub').then((m) => m.getStub),
);

export const POST = stubEllerVideresendTilAndreYtelser<{ personPseudoId: string }>(() =>
    import('./stub').then((m) => m.postStub),
);
