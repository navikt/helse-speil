import { postJson } from '@app/fetch/fetchClient';
import { useQuery } from '@tanstack/react-query';

import { withDefaultQueryOptions } from './defaultQueryOptions';

export type SpleisVedtaksperiodeRequest = {
    fødselsnummer: string;
};

// Responsen inneholder flere felter (behandlinger, gjeldende m.m.), men vi typer bare det vi bruker
export type SpleisVedtaksperiode = {
    organisasjonsnummer: string;
    yrkesaktivitetstype: string;
    id: string;
    tilstand: string;
    skjæringstidspunkt: string;
    fom: string;
    tom: string;
    sykmeldingFom: string;
    sykmeldingTom: string;
    opprettet: string;
    oppdatert: string;
};

const postHentVedtaksperiode = (vedtaksperiodeId: string, fødselsnummer: string, signal?: AbortSignal) =>
    postJson<SpleisVedtaksperiode>(
        `/api/spleis/vedtaksperiode/${vedtaksperiodeId}`,
        { fødselsnummer } satisfies SpleisVedtaksperiodeRequest,
        { signal },
    );

export const getSpleisVedtaksperiodeQueryKey = (vedtaksperiodeId?: string, fødselsnummer?: string) =>
    ['/api/spleis/vedtaksperiode/{vedtaksperiodeId}', vedtaksperiodeId, fødselsnummer] as const;

export const useSpleisVedtaksperiodeQuery = (vedtaksperiodeId?: string, fødselsnummer?: string) =>
    useQuery(
        withDefaultQueryOptions({
            queryKey: getSpleisVedtaksperiodeQueryKey(vedtaksperiodeId, fødselsnummer),
            queryFn: ({ signal }) => postHentVedtaksperiode(vedtaksperiodeId!, fødselsnummer!, signal),
            enabled: !!vedtaksperiodeId && !!fødselsnummer,
        }),
    );
