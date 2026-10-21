import {
    ApiArbeidsforholdoverstyring,
    ApiDagoverstyring,
    ApiInntektoverstyring,
} from '@io/rest/generated/spesialist.schemas';
import { OverridableConstructor } from '@typer/shared';
import { generateId } from '@utils/generateId';

export const enDagoverstyring: OverridableConstructor<
    // TODO: Erstatte global type med query type
    ApiDagoverstyring
> = (overrides) => ({
    type: 'ApiDagoverstyring',
    vedtaksperiodeId: '',
    begrunnelse: 'En begrunnelse',
    dager: [],
    hendelseId: generateId(),
    saksbehandler: {
        ident: 'A123456',
        navn: 'En saksbehandler',
    },
    timestamp: '2020-01-01',
    ferdigstilt: false,
    ...overrides,
});

export const enArbeidsforholdoverstyring: OverridableConstructor<ApiArbeidsforholdoverstyring> = (overrides) => ({
    type: 'ApiArbeidsforholdoverstyring',
    vedtaksperiodeId: '',
    begrunnelse: 'En begrunnelse',
    deaktivert: false,
    forklaring: 'En forklaring',
    hendelseId: generateId(),
    saksbehandler: {
        ident: 'A123456',
        navn: 'En saksbehandler',
    },
    skjaeringstidspunkt: '2020-01-01',
    timestamp: '2020-01-01',
    ferdigstilt: false,
    ...overrides,
});

export const enInntektoverstyring: OverridableConstructor<ApiInntektoverstyring> = (overrides) => ({
    type: 'ApiInntektoverstyring',
    vedtaksperiodeId: '',
    begrunnelse: 'En begrunnelse',
    hendelseId: generateId(),
    inntekt: {
        forklaring: 'En forklaring',
        fraManedligInntekt: 30000,
        manedligInntekt: 30000,
        skjaeringstidspunkt: '2020-01-01',
        refusjonsopplysninger: [],
        fraRefusjonsopplysninger: [],
        begrunnelse: 'En begrunnelse',
    },
    saksbehandler: {
        ident: 'A123456',
        navn: 'En saksbehandler',
    },
    timestamp: '2020-01-01',
    ferdigstilt: false,
    ...overrides,
});
