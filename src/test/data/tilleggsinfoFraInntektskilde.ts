import { ApiTilleggsinfoForInntektskilde } from '@io/rest/generated/spesialist.schemas';
import { OverridableConstructor } from '@typer/shared';

export const tilleggsinfoFraEnInntektskilde: OverridableConstructor<ApiTilleggsinfoForInntektskilde> = (overrides) => ({
    navn: 'Sjokkerende Elektriker',
    orgnummer: '987654321',
    ...overrides,
});
