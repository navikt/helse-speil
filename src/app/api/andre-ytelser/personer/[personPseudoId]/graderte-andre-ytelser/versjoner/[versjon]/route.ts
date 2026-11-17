import { stubEllerVideresendTilAndreYtelser } from '@app/api/andre-ytelser/common';

export const GET = stubEllerVideresendTilAndreYtelser<{ personPseudoId: string; versjon: string }>(() =>
    import('./stub').then((m) => m.stub),
);
