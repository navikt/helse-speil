type ReactNode = import('react').ReactNode;

type Kommentar = import('@io/graphql').Kommentar;
type OverstyrtDag = import('@io/graphql').OverstyrtDag;
type Utbetalingtype = import('@io/graphql').Utbetalingtype;
type OverstyrtInntekt = import('@io/graphql').OverstyrtInntekt;
type PeriodehistorikkType = import('@io/graphql').PeriodehistorikkType;

declare type Filtertype = 'Dokument' | 'Historikk' | 'Notat';

declare type Hendelsetype =
    | 'Dagoverstyring'
    | 'Arbeidsforholdoverstyring'
    | 'AnnetArbeidsforholdoverstyring'
    | 'Inntektoverstyring'
    | 'Dokument'
    | 'Notat'
    | 'Utbetaling'
    | 'Historikk';

declare type BaseHendelseObject = {
    id: string;
    type: Hendelsetype;
    timestamp?: DateString;
    saksbehandler?: Maybe<string>;
};

declare type DagoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Dagoverstyring';
    erRevurdering: boolean;
    saksbehandler: string;
    timestamp: DateString;
    begrunnelse: string;
    dager: Array<OverstyrtDag>;
};

declare type ArbeidsforholdoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Arbeidsforholdoverstyring';
    erDeaktivert: boolean;
    saksbehandler: string;
    timestamp: DateString;
    begrunnelse: string;
    forklaring: string;
    skjæringstidspunkt: DateString;
};

declare type AnnetArbeidsforholdoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Arbeidsforholdoverstyring';
    erDeaktivert: boolean;
    saksbehandler: string;
    timestamp: DateString;
    begrunnelse: string;
    forklaring: string;
    skjæringstidspunkt: DateString;
    navn: string;
};

declare type InntektoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Inntektoverstyring';
    erRevurdering: boolean;
    saksbehandler: string;
    timestamp: DateString;
    inntekt: OverstyrtInntekt;
};

declare type DokumenthendelseObject = BaseHendelseObject & {
    type: 'Dokument';
    dokumenttype: 'Inntektsmelding' | 'Sykmelding' | 'Søknad';
    timestamp: DateString;
};

declare type NotathendelseObject = BaseHendelseObject & {
    type: 'Notat';
    tekst: string;
    notattype: NotatType;
    saksbehandler: string;
    saksbehandlerOid: string;
    timestamp: DateString;
    feilregistrert: boolean;
    vedtaksperiodeId: string;
    kommentarer: Array<Kommentar>;
};

declare type UtbetalinghendelseObject = BaseHendelseObject & {
    type: 'Utbetaling';
    automatisk: boolean;
    godkjent: boolean;
    utbetalingstype: Utbetalingtype;
    saksbehandler: string;
    timestamp: DateString;
};

declare type HistorikkhendelseObject = BaseHendelseObject & {
    type: 'Historikk';
    historikktype: PeriodehistorikkType;
    timestamp: DateString;
};

declare type HendelseObject =
    | DagoverstyringhendelseObject
    | ArbeidsforholdoverstyringhendelseObject
    | AnnetArbeidsforholdoverstyringhendelseObject
    | InntektoverstyringhendelseObject
    | DokumenthendelseObject
    | NotathendelseObject
    | UtbetalinghendelseObject
    | HistorikkhendelseObject;
