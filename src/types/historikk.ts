import {
    ApiHandlingType,
    ApiOverstyrtDag,
    ApiOverstyrtInntekt,
    ApiOverstyrtMinimumSykdomsgrad,
    ApiPeriodehistorikkType,
    ApiSkjonnsfastsattSykepengegrunnlag,
    ApiUtbetalingtype,
    ApiVedtakUtfall,
} from '@io/rest/generated/spesialist.schemas';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';
import { Kommentar } from '@typer/notat';

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
    | 'VedtakBegrunnelse'
    | 'Annullering'
    | 'TilkommenInntekt'
    | 'Saksbehandlerhandling';

export type ArbeidsgiverSkjønnHendelse = {
    inntektsforholdReferanse: InntektsforholdReferanse;
    årlig: number;
    fraÅrlig: number;
};

export type BaseHendelseObject = {
    id: string;
    type: Hendelsetype;
    timestamp?: DateString;
    saksbehandler?: string | null;
};

export type DagoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Dagoverstyring';
    erRevurdering: boolean;
    saksbehandler: string;
    timestamp: DateString;
    begrunnelse: string;
    dager: ApiOverstyrtDag[];
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
    inntektsforholdReferanse: InntektsforholdReferanse;
};

export type InntektoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Inntektoverstyring';
    erRevurdering: boolean;
    saksbehandler: string;
    timestamp: DateString;
    inntekt: ApiOverstyrtInntekt;
    inntektsforholdReferanse: InntektsforholdReferanse;
};

export type SykepengegrunnlagskjonnsfastsettinghendelseObject = BaseHendelseObject & {
    type: 'Sykepengegrunnlagskjonnsfastsetting';
    saksbehandler: string;
    timestamp: DateString;
    skjønnsfastsatt: ApiSkjonnsfastsattSykepengegrunnlag;
    arbeidsgivere: ArbeidsgiverSkjønnHendelse[];
};

export type MinimumSykdomsgradhendelseObject = BaseHendelseObject & {
    type: 'MinimumSykdomsgradoverstyring';
    saksbehandler: string;
    timestamp: DateString;
    minimumSykdomsgrad: ApiOverstyrtMinimumSykdomsgrad;
};

export type DokumenthendelseObject = BaseHendelseObject & {
    type: 'Dokument';
    dokumenttype: 'Inntektsmelding' | 'Sykmelding' | 'Søknad' | 'Vedtak' | 'InntektHentetFraAordningen';
    timestamp: DateString;
    dokumentId?: string | null;
};

export type NotathendelseObject = BaseHendelseObject & {
    dialogRef: number;
    type: 'Notat';
    tekst: string;
    erOpphevStans: boolean;
    saksbehandler: string;
    timestamp: DateString;
    feilregistrert: boolean;
    vedtaksperiodeId: string;
    kommentarer: Kommentar[];
    erNyesteNotatMedType: boolean;
};

export type UtbetalinghendelseObject = BaseHendelseObject & {
    type: 'Utbetaling';
    automatisk: boolean;
    godkjent: boolean;
    utbetalingstype: ApiUtbetalingtype;
    saksbehandler: string;
    timestamp: DateString;
};

export type HistorikkhendelseObject = BaseHendelseObject & {
    historikkinnslagId: number;
    type: 'Historikk';
    historikktype: ApiPeriodehistorikkType;
    timestamp: DateString;
    dialogRef: number | null;
    saksbehandler: string | null;
    frist: DateString | null;
    årsaker: string[];
    notattekst: string | null;
    kommentarer: Kommentar[];
    erNyestePåVentInnslag?: boolean;
};

export type VedtakBegrunnelseObject = BaseHendelseObject & {
    type: 'VedtakBegrunnelse';
    utfall: ApiVedtakUtfall;
    begrunnelse: string;
    timestamp: DateString;
    saksbehandler: string;
};

export type SaksbehandlerhandlinghendelseObject = BaseHendelseObject & {
    type: 'Saksbehandlerhandling';
    handlingType: ApiHandlingType;
    timestamp: DateString;
    saksbehandler: string;
};

export type AnnulleringhendelseObject = BaseHendelseObject & {
    type: 'Annullering';
    årsaker: string[];
    begrunnelse: string | null;
    timestamp: DateString;
    saksbehandler: string;
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
    | VedtakBegrunnelseObject
    | AnnulleringhendelseObject
    | SaksbehandlerhandlinghendelseObject;
