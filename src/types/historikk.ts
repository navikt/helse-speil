import {
    Avslagstype,
    Kommentar,
    Maybe,
    NotatType,
    OverstyrtDag,
    OverstyrtInntekt,
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
    | 'Dokument'
    | 'Notat'
    | 'Utbetaling'
    | 'Historikk'
    | 'Avslag';

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

export type DokumenthendelseObject = BaseHendelseObject & {
    type: 'Dokument';
    dokumenttype: 'Inntektsmelding' | 'Sykmelding' | 'Søknad';
    timestamp: DateString;
    dokumentId?: Maybe<string>;
};

export type NotathendelseObject = BaseHendelseObject & {
    type: 'Notat';
    tekst: string;
    notattype: NotatType;
    saksbehandler: string;
    saksbehandlerOid: string;
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

export type HistorikkhendelseObject = BaseHendelseObject & {
    type: 'Historikk';
    historikktype: PeriodehistorikkType;
    timestamp: DateString;
};

export type AvslaghendelseObject = BaseHendelseObject & {
    type: 'Avslag';
    avslagstype: Avslagstype;
    begrunnelse: string;
};

export type HendelseObject =
    | DagoverstyringhendelseObject
    | ArbeidsforholdoverstyringhendelseObject
    | AnnetArbeidsforholdoverstyringhendelseObject
    | InntektoverstyringhendelseObject
    | SykepengegrunnlagskjonnsfastsettinghendelseObject
    | DokumenthendelseObject
    | NotathendelseObject
    | UtbetalinghendelseObject
    | HistorikkhendelseObject
    | AvslaghendelseObject;
