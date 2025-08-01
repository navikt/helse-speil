export interface Lovhjemmel {
    paragraf: string;
    ledd?: string;
    bokstav?: string;
    lovverk: string;
    lovverksversjon: string;
}

export interface BegrunnelseForOverstyring {
    id: string;
    forklaring: string;
    lovhjemmel?: Lovhjemmel;
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
    fom?: string | null;
    tom?: string | null;
}

export interface Refusjonsopplysning {
    fom: string;
    tom?: string | null;
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
    initierendeVedtaksperiodeId: string | null;
}

export enum SkjønnsfastsettingstypeDTO {
    OMREGNET_ÅRSINNTEKT = 'OMREGNET_ÅRSINNTEKT',
    RAPPORTERT_ÅRSINNTEKT = 'RAPPORTERT_ÅRSINNTEKT',
    ANNET = 'ANNET',
}

export interface OverstyrtMinimumSykdomsgradDTO {
    aktørId: string;
    fødselsnummer: string;
    perioderVurdertOk: MinimumSykdomsgradPeriode[];
    perioderVurdertIkkeOk: MinimumSykdomsgradPeriode[];
    begrunnelse: string;
    arbeidsgivere: MinimumSykdomsgradArbeidsgiver[];
    initierendeVedtaksperiodeId: string;
}

export interface MinimumSykdomsgradPeriode {
    fom: string;
    tom: string;
}

export interface MinimumSykdomsgradArbeidsgiver {
    organisasjonsnummer: string;
    berørtVedtaksperiodeId: string;
}
