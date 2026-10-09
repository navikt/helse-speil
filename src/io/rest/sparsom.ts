import { postJson } from '@app/fetch/fetchClient';
import { useQuery } from '@tanstack/react-query';

import { withDefaultQueryOptions } from './defaultQueryOptions';

export type SparsomAktiviteterRequest = {
    ident: string;
};

export type SparsomAktivitetNivå = 'INFO' | 'BEHOV' | 'VARSEL' | 'FUNKSJONELL_FEIL' | 'LOGISK_FEIL';

export type SparsomKontekst = Record<string, string | undefined>;

export type SparsomAktivitet = {
    id: number;
    tidsstempel: string;
    nivå: SparsomAktivitetNivå;
    tekst: string;
    kontekster: Record<string, SparsomKontekst>;
};

export type SparsomAktiviteterResponse = {
    aktiviteter: SparsomAktivitet[];
};

export function getSparsomAktiviteterQueryKey(fødselsnummer?: string) {
    return ['/api/sparsom/aktiviteter', fødselsnummer] as const;
}

export function useSparsomAktiviteterQuery(fødselsnummer?: string) {
    return useQuery(
        withDefaultQueryOptions({
            queryKey: getSparsomAktiviteterQueryKey(fødselsnummer),
            queryFn: ({ signal }) => postHentAktiviteter(fødselsnummer!, signal),
            enabled: !!fødselsnummer,
        }),
    );
}

function postHentAktiviteter(fødselsnummer: string, signal?: AbortSignal) {
    return postJson<SparsomAktiviteterResponse>(
        '/api/sparsom/aktiviteter',
        { ident: fødselsnummer } satisfies SparsomAktiviteterRequest,
        { signal },
    );
}
