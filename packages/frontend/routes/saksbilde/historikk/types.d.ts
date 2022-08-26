type OverstyrtDag = import('@io/graphql').OverstyrtDag;
type PeriodehistorikkType = import('@io/graphql').PeriodehistorikkType;
type Utbetalingtype = import('@io/graphql').Utbetalingtype;
type ReactNode = import('react').ReactNode;

declare type Filtertype = 'Dokument' | 'Historikk';

declare type Hendelsetype =
    | 'Dagoverstyring'
    | 'Arbeidsforholdoverstyring'
    | 'Inntektoverstyring'
    | 'Dokument'
    | 'Notat'
    | 'Utbetaling'
    | 'Historikk';

declare type BaseHendelseObject = {
    id: string;
    type: Hendelsetype;
    timestamp?: DateString;
    saksbehandler?: string;
};

declare type DagoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Dagoverstyring';
    erRevurdering: boolean;
    saksbehandler: string;
    timestamp: string;
    begrunnelse: string;
    dager: Array<OverstyrtDag>;
};

declare type ArbeidsforholdoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Arbeidsforholdoverstyring';
    erDeaktivert: boolean;
    saksbehandler: string;
    timestamp: string;
};

declare type InntektoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Inntektoverstyring';
    erRevurdering: boolean;
    saksbehandler: string;
    timestamp: string;
};

declare type DokumenthendelseObject = BaseHendelseObject & {
    type: 'Dokument';
    dokumenttype: 'Inntektsmelding' | 'Sykmelding' | 'Søknad';
    timestamp: string;
};

declare type NotathendelseObject = BaseHendelseObject & {
    type: 'Notat';
    tekst: string;
    notattype: NotatType;
    saksbehandler: string;
    timestamp: string;
};

declare type UtbetalinghendelseObject = BaseHendelseObject & {
    type: 'Utbetaling';
    automatisk: boolean;
    godkjent: boolean;
    utbetalingstype: Utbetalingtype;
    saksbehandler: string;
    timestamp: string;
};

declare type HistorikkhendelseObject = BaseHendelseObject & {
    type: 'Historikk';
    historikktype: PeriodehistorikkType;
    saksbehandler: string;
    timestamp: string;
};

declare type HendelseObject =
    | DagoverstyringhendelseObject
    | ArbeidsforholdoverstyringhendelseObject
    | InntektoverstyringhendelseObject
    | DokumenthendelseObject
    | NotathendelseObject
    | UtbetalinghendelseObject
    | HistorikkhendelseObject;
