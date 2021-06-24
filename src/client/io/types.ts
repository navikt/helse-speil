import { Dagtype } from 'internal-types';

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
    månedsbeløp: number;
    skjæringstidspunkt: string;
    forklaring: string;
}

export interface AnnulleringDTO {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    fagsystemId: string;
}

export interface PersonoppdateringDTO {
    fødselsnummer: string;
}
