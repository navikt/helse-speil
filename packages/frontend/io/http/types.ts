import { Lovhjemmel } from '../../routes/saksbilde/sykepengegrunnlag/overstyring/overstyring.types';

export interface Options {
    method?: string;
    headers?: { [key: string]: unknown };
}

export type OverstyrtDagtype =
    | 'Sykedag'
    | 'SykedagNav'
    | 'Feriedag'
    | 'Egenmeldingsdag'
    | 'Permisjonsdag'
    | 'ArbeidIkkeGjenopptattDag'
    | 'Arbeidsdag'
    | 'Foreldrepengerdag'
    | 'AAPdag'
    | 'Omsorgspengerdag'
    | 'Pleiepengerdag'
    | 'Svangerskapspengerdag'
    | 'Opplaringspengerdag'
    | 'Dagpengerdag'
    // Disse støtter ikke Spleis å motta, men kan overstyre _fra_ dem
    | 'Avvistdag'
    | 'Helg';

export interface OverstyrtDagDTO {
    dato: string;
    type: OverstyrtDagtype;
    fraType: OverstyrtDagtype;
    grad?: number;
    fraGrad?: number;
    lovhjemmel?: Lovhjemmel;
}

export interface OverstyrtInntektOgRefusjonDTO {
    aktørId: string;
    fødselsnummer: string;
    skjæringstidspunkt: string;
    arbeidsgivere: OverstyrtInntektOgRefusjonArbeidsgiver[];
    vedtaksperiodeId: string;
}

export interface OverstyrtInntektOgRefusjonArbeidsgiver {
    organisasjonsnummer: string;
    månedligInntekt: number;
    fraMånedligInntekt: number;
    refusjonsopplysninger: Refusjonsopplysning[];
    fraRefusjonsopplysninger: Refusjonsopplysning[];
    forklaring: string;
    begrunnelse: string;
    lovhjemmel?: Lovhjemmel;
}

export interface Refusjonsopplysning {
    fom: string;
    tom?: Maybe<string>;
    beløp: number;
    kilde: string;
}

export interface OverstyrtArbeidsforholdDTO {
    fødselsnummer: string;
    aktørId: string;
    skjæringstidspunkt: string;
    overstyrteArbeidsforhold: OverstyrtArbeidsforholdElementDTO[];
    vedtaksperiodeId: string;
}

export interface OverstyrtArbeidsforholdElementDTO {
    orgnummer: string;
    deaktivert: boolean;
    forklaring: string;
    begrunnelse: string;
    lovhjemmel?: Lovhjemmel;
}

export interface SkjønnsfastsattSykepengegrunnlagDTO {
    aktørId: string;
    fødselsnummer: string;
    skjæringstidspunkt: string;
    arbeidsgivere: SkjønnsfastsattArbeidsgiver[];
    vedtaksperiodeId: string;
}

export interface SkjønnsfastsattArbeidsgiver {
    organisasjonsnummer: string;
    årlig: number;
    fraÅrlig: number;
    årsak: string;
    type: SkjønnsfastsettingstypeDTO;
    begrunnelseMal?: string;
    begrunnelseFritekst?: string;
    begrunnelseKonklusjon?: string;
    lovhjemmel?: Lovhjemmel;
    initierendeVedtaksperiodeId: Maybe<string>;
}

export enum SkjønnsfastsettingstypeDTO {
    OMREGNET_ÅRSINNTEKT = 'OMREGNET_ÅRSINNTEKT',
    RAPPORTERT_ÅRSINNTEKT = 'RAPPORTERT_ÅRSINNTEKT',
    ANNET = 'ANNET',
}
