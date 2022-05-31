export interface Options {
    method?: string;
    headers?: { [key: string]: any };
}

export interface OverstyrtDagDTO {
    dato: string;
    type: 'Sykedag' | 'Feriedag' | 'Egenmeldingsdag' | 'Permisjonsdag' | 'Avvist';
    grad?: number;
}

interface Overstyring {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    begrunnelse: string;
}

export interface OverstyrteDagerDTO extends Overstyring {
    dager: OverstyrtDagDTO[];
}

export interface OverstyrtInntektDTO extends Overstyring {
    månedligInntekt: number;
    skjæringstidspunkt: string;
    forklaring: string;
}

export interface OverstyrtArbeidsforholdDTO {
    fødselsnummer: string;
    organisasjonsnummer: string;
    aktørId: string;
    skjæringstidspunkt: string;
    overstyrteArbeidsforhold: OverstyrtArbeidsforholdElementDTO[];
}

export interface OverstyrtArbeidsforholdElementDTO {
    orgnummer: string;
    deaktivert: boolean;
    begrunnelse: string;
    forklaring: string;
}

export interface AnnulleringDTO {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    fagsystemId: string;
    gjelderSisteSkjæringstidspunkt: boolean;
    begrunnelser?: string[];
    kommentar?: string;
}

export interface PersonoppdateringDTO {
    fødselsnummer: string;
}

export interface NotatDTO {
    tekst: string;
    type: ExternalNotatType;
}
