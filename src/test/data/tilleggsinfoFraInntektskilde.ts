import { TilleggsinfoForInntektskildeFragment } from '@io/graphql';
import { OverridableConstructor } from '@typer/shared';

export const tilleggsinfoFraEnInntektskilde: OverridableConstructor<TilleggsinfoForInntektskildeFragment> = (
    overrides,
) => ({
    __typename: 'TilleggsinfoForInntektskilde',
    navn: 'Sjokkerende Elektriker',
    orgnummer: '987654321',
    ...overrides,
});
