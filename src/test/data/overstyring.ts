import { Arbeidsforholdoverstyring, Dagoverstyring, Inntektoverstyring } from '@io/graphql';
import { OverridableConstructor } from '@typer/shared';
import { generateId } from '@utils/generateId';

export const enDagoverstyring: OverridableConstructor<
    // TODO: Erstatte global type med query type
    Dagoverstyring
> = (overrides) => ({
    __typename: 'Dagoverstyring',
    vedtaksperiodeId: '',
    begrunnelse: 'En begrunnelse',
    dager: [],
    hendelseId: generateId(),
    saksbehandler: {
        __typename: 'Saksbehandler',
        ident: 'A123456',
        navn: 'En saksbehandler',
    },
    timestamp: '2020-01-01',
    ferdigstilt: false,
    ...overrides,
});

export const enArbeidsforholdoverstyring: OverridableConstructor<Arbeidsforholdoverstyring> = (overrides) => ({
    __typename: 'Arbeidsforholdoverstyring',
    vedtaksperiodeId: '',
    begrunnelse: 'En begrunnelse',
    deaktivert: false,
    forklaring: 'En forklaring',
    hendelseId: generateId(),
    saksbehandler: {
        __typename: 'Saksbehandler',
        ident: 'A123456',
        navn: 'En saksbehandler',
    },
    skjaeringstidspunkt: '2020-01-01',
    timestamp: '2020-01-01',
    ferdigstilt: false,
    ...overrides,
});

export const enInntektoverstyring: OverridableConstructor<Inntektoverstyring> = (overrides) => ({
    __typename: 'Inntektoverstyring',
    vedtaksperiodeId: '',
    begrunnelse: 'En begrunnelse',
    hendelseId: generateId(),
    inntekt: {
        __typename: 'OverstyrtInntekt',
        forklaring: 'En forklaring',
        fraManedligInntekt: 30000,
        manedligInntekt: 30000,
        skjaeringstidspunkt: '2020-01-01',
        refusjonsopplysninger: [],
        fraRefusjonsopplysninger: [],
        begrunnelse: 'En begrunnelse',
    },
    saksbehandler: {
        __typename: 'Saksbehandler',
        ident: 'A123456',
        navn: 'En saksbehandler',
    },
    timestamp: '2020-01-01',
    ferdigstilt: false,
    ...overrides,
});
