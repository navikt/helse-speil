import { OverstyrtDag, Sykdomsdag } from '../context/types.internal';

export interface Options {
    method?: string;
    headers?: { [key: string]: any };
}

export interface OverstyringDTO {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    begrunnelse: string;
    dager: OverstyrtDag[];
    unntaFraInnsyn: boolean;
}

export interface AnnulleringDTO {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    fagsystemId: string;
    vedtaksperiodeId: string;
}
