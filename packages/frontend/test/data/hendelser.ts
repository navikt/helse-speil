import { Dagtype, PeriodehistorikkType, Utbetalingtype } from '@io/graphql';
import { nanoid } from 'nanoid';

export const enArbeidsforholdoverstyringhendelse = (
    overrides: Partial<ArbeidsforholdoverstyringhendelseObject> = {},
): ArbeidsforholdoverstyringhendelseObject => ({
    id: nanoid(),
    type: 'Arbeidsforholdoverstyring',
    erDeaktivert: false,
    saksbehandler: 'en-saksbehandler',
    timestamp: '2020-01-01',
    begrunnelse: 'En begrunnelse',
    forklaring: 'En forklaring',
    skjæringstidspunkt: '2020-01-01',
    ...overrides,
});

export const enDagoverstyringhendelse = (
    overrides: Partial<DagoverstyringhendelseObject> = {},
): DagoverstyringhendelseObject => ({
    id: 'en-dagoverstyring',
    type: 'Dagoverstyring',
    erRevurdering: false,
    saksbehandler: 'en-saksbehandler',
    timestamp: '2020-01-01',
    begrunnelse: 'En begrunnelse',
    dager: [
        {
            dato: '2020-01-01',
            grad: 100,
            type: Dagtype.Sykedag,
        },
    ],
    ...overrides,
});

export const enInntektoverstyringhendelse = (
    overrides: Partial<InntektoverstyringhendelseObject> = {},
): InntektoverstyringhendelseObject => ({
    id: 'en-inntektoverstyring',
    type: 'Inntektoverstyring',
    erRevurdering: false,
    saksbehandler: 'en-saksbehandler',
    timestamp: '2020-01-01',
    begrunnelse: 'En begrunnelse',
    inntekt: {
        forklaring: 'En forklaring',
        manedligInntekt: 30000.0,
        skjaeringstidspunkt: '2020-01-01',
    },
    ...overrides,
});

export const enDokumenthendelse = (
    type: DokumenthendelseObject['dokumenttype'],
    overrides: Partial<DokumenthendelseObject> = {},
): DokumenthendelseObject => ({
    id: `en-${type}`,
    type: 'Dokument',
    dokumenttype: type,
    timestamp: '2020-01-01',
    ...overrides,
});

export const enNotathendelse = (overrides: Partial<NotathendelseObject> = {}): NotathendelseObject => ({
    id: 'en-notathendelse',
    type: 'Notat',
    tekst: 'En tekst',
    notattype: 'Generelt',
    saksbehandler: 'en-saksbehandler',
    saksbehandlerOid: 'en-saksbehandler-oid',
    timestamp: '2020-01-01',
    feilregistrert: false,
    vedtaksperiodeId: 'en-vedtaksperiode',
    ...overrides,
});

export const enUtbetalinghendelse = (overrides: Partial<UtbetalinghendelseObject> = {}): UtbetalinghendelseObject => ({
    id: 'en-utbetalinghendelse',
    type: 'Utbetaling',
    automatisk: false,
    godkjent: true,
    utbetalingstype: Utbetalingtype.Utbetaling,
    saksbehandler: 'en-saksbehandler',
    timestamp: '2020-01-01',
    ...overrides,
});

export const enHistorikkhendelse = (overrides: Partial<HistorikkhendelseObject> = {}): HistorikkhendelseObject => ({
    id: 'en-historikkhendelse',
    type: 'Historikk',
    historikktype: PeriodehistorikkType.TotrinnsvurderingAttestert,
    saksbehandler: 'en-saksbehandler',
    timestamp: '2020-01-01',
    ...overrides,
});
