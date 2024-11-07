import {
    Avslagstype,
    Kommentar,
    Maybe,
    NotatFragment,
    NotatType,
    OverstyrtDag,
    OverstyrtInntekt,
    OverstyrtMinimumSykdomsgrad,
    PeriodehistorikkType,
    SkjonnsfastsattSykepengegrunnlag,
    Utbetalingtype,
} from '@io/graphql';

import { DateString } from './shared';

export type Filtertype = 'Dokument' | 'Historikk' | 'Notat' | 'Overstyring';

export type Hendelsetype =
    | 'Dagoverstyring'
    | 'Arbeidsforholdoverstyring'
    | 'AnnetArbeidsforholdoverstyring'
    | 'Inntektoverstyring'
    | 'Sykepengegrunnlagskjonnsfastsetting'
    | 'MinimumSykdomsgradoverstyring'
    | 'Dokument'
    | 'Notat'
    | 'Utbetaling'
    | 'Historikk'
    | 'Avslag'
    | 'Annullering';

export type ArbeidsgiverSkjønnHendelse = {
    navn: string;
    årlig: number;
    fraÅrlig: number;
};

export type BaseHendelseObject = {
    id: string;
    type: Hendelsetype;
    timestamp?: DateString;
    saksbehandler?: Maybe<string>;
};

export type DagoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Dagoverstyring';
    erRevurdering: boolean;
    saksbehandler: string;
    timestamp: DateString;
    begrunnelse: string;
    dager: Array<OverstyrtDag>;
};

export type ArbeidsforholdoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Arbeidsforholdoverstyring';
    erDeaktivert: boolean;
    saksbehandler: string;
    timestamp: DateString;
    begrunnelse: string;
    forklaring: string;
    skjæringstidspunkt: DateString;
};

export type AnnetArbeidsforholdoverstyringhendelseObject = BaseHendelseObject & {
    type: 'AnnetArbeidsforholdoverstyring';
    erDeaktivert: boolean;
    saksbehandler: string;
    timestamp: DateString;
    begrunnelse: string;
    forklaring: string;
    skjæringstidspunkt: DateString;
    navn: string;
};

export type InntektoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Inntektoverstyring';
    erRevurdering: boolean;
    saksbehandler: string;
    timestamp: DateString;
    inntekt: OverstyrtInntekt;
};

export type SykepengegrunnlagskjonnsfastsettinghendelseObject = BaseHendelseObject & {
    type: 'Sykepengegrunnlagskjonnsfastsetting';
    saksbehandler: string;
    timestamp: DateString;
    skjønnsfastsatt: SkjonnsfastsattSykepengegrunnlag;
    arbeidsgivere: ArbeidsgiverSkjønnHendelse[];
};

export type MinimumSykdomsgradhendelseObject = BaseHendelseObject & {
    type: 'MinimumSykdomsgradoverstyring';
    saksbehandler: string;
    timestamp: DateString;
    minimumSykdomsgrad: OverstyrtMinimumSykdomsgrad;
};

export type DokumenthendelseObject = BaseHendelseObject & {
    type: 'Dokument';
    dokumenttype: 'Inntektsmelding' | 'Sykmelding' | 'Søknad' | 'Vedtak';
    timestamp: DateString;
    dokumentId?: Maybe<string>;
};

export type NotathendelseObject = BaseHendelseObject & {
    type: 'Notat';
    tekst: string;
    notattype: NotatType;
    saksbehandler: string;
    timestamp: DateString;
    feilregistrert: boolean;
    vedtaksperiodeId: string;
    kommentarer: Array<Kommentar>;
    erNyesteNotatMedType: boolean;
};

export type UtbetalinghendelseObject = BaseHendelseObject & {
    type: 'Utbetaling';
    automatisk: boolean;
    godkjent: boolean;
    utbetalingstype: Utbetalingtype;
    saksbehandler: string;
    timestamp: DateString;
};

export type HistorikkhendelseBase = BaseHendelseObject & {
    type: 'Historikk';
    historikktype: PeriodehistorikkType;
    timestamp: DateString;
};

export type LagtPaVentHistorikkhendelseObject = HistorikkhendelseBase & {
    saksbehandler: string;
    dialogRef: Maybe<number>;
    notatId: Maybe<number>;
    frist: Maybe<DateString>;
    årsaker: string[];
    notatTekst: Maybe<string>;
    kommentarer: Array<Kommentar>;
    erNyesteHistorikkhendelseMedType?: boolean;
};

export type HistorikkhendelseMedNotatObject = HistorikkhendelseBase & {
    notat: NotatFragment;
};

export type HistorikkhendelseObject = LagtPaVentHistorikkhendelseObject | HistorikkhendelseMedNotatObject;

export type AvslaghendelseObject = BaseHendelseObject & {
    type: 'Avslag';
    avslagstype: Avslagstype;
    begrunnelse: string;
};

export type AnnulleringhendelseObject = BaseHendelseObject & {
    type: 'Annullering';
    årsaker: string[];
    begrunnelse: string | null;
};

export type HendelseObject =
    | DagoverstyringhendelseObject
    | ArbeidsforholdoverstyringhendelseObject
    | AnnetArbeidsforholdoverstyringhendelseObject
    | InntektoverstyringhendelseObject
    | SykepengegrunnlagskjonnsfastsettinghendelseObject
    | MinimumSykdomsgradhendelseObject
    | DokumenthendelseObject
    | NotathendelseObject
    | UtbetalinghendelseObject
    | HistorikkhendelseObject
    | AvslaghendelseObject
    | AnnulleringhendelseObject;
