import { Subsumsjon } from '../../routes/saksbilde/sykepengegrunnlag/overstyring.types';

export interface Options {
    method?: string;
    headers?: { [key: string]: any };
}

export interface OverstyrtDagDTO {
    dato: string;
    type: 'Sykedag' | 'Feriedag' | 'Egenmeldingsdag' | 'Permisjonsdag' | 'Avvist';
    fraType: 'Sykedag' | 'Feriedag' | 'Egenmeldingsdag' | 'Permisjonsdag' | 'Avvist';
    grad?: number;
    fraGrad?: number;
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
    fraMånedligInntekt: number;
    skjæringstidspunkt: string;
    forklaring: string;
    subsumsjon?: Subsumsjon;
    refusjonsopplysninger?: Refusjonsopplysning[];
    fraRefusjonsopplysninger?: Refusjonsopplysning[];
}

export interface Refusjonsopplysning {
    fom: string;
    tom?: Maybe<string>;
    beløp: number;
}

export interface OverstyrtArbeidsforholdDTO {
    fødselsnummer: string;
    aktørId: string;
    skjæringstidspunkt: string;
    overstyrteArbeidsforhold: OverstyrtArbeidsforholdElementDTO[];
}

export interface OverstyrtArbeidsforholdElementDTO {
    orgnummer: string;
    deaktivert: boolean;
    forklaring: string;
    begrunnelse: string;
    subsumsjon?: Subsumsjon;
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
