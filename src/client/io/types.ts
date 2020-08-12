import { Sykdomsdag } from '../context/types.internal';

export interface Options {
    method?: string;
    headers?: { [key: string]: any };
}

export interface OverstyringDTO {
    vedtaksperiodeId: string;
    begrunnelse: string;
    dager: Sykdomsdag[];
    unntaFraInnsyn: boolean;
}

export interface AnnulleringDTO {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    fagsystemId: string;
    vedtaksperiodeId: string;
}
