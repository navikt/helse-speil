import { ApiTotrinnsvurdering } from '@io/rest/generated/spesialist.schemas';
import { OverridableConstructor } from '@typer/shared';

export const enTotrinnsvurdering: OverridableConstructor<ApiTotrinnsvurdering> = (overrides) => ({
    erBeslutteroppgave: false,
    erRetur: false,
    saksbehandler: null,
    beslutter: null,
    ...overrides,
});
