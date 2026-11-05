import { HttpError, getJson, postJson } from '@app/fetch/fetchClient';
import { useMutation, useQuery } from '@tanstack/react-query';

import { withDefaultQueryOptions } from './defaultQueryOptions';

export type Rettighetskategori = {
    id: string;
    skjæringstidspunkt: string;
    hovedkategori: 'ARBEIDSTAKER' | 'SELVSTENDIG_NAERINGSDRIVENDE' | 'ARBEIDSTAKER_OG_SELVSTENDIG_NAERINGSDRIVENDE';
    tilleggskategorier: 'JORDBRUKER'[];
    kilde: 'AUTOMATISK' | 'SAKSBEHANDLER' | 'SPLEIS';
    vurderingstidspunkt: string;
};

export const getRettighetskategoriQueryKey = (personPseudoId?: string, rettighetskategoriId?: string) =>
    [
        '/api/rettighetskategori/personer/{personPseudoId}/rettighetskategorier/{rettighetskategoriId}',
        personPseudoId,
        rettighetskategoriId,
    ] as const;

export const useRettighetskategoriQuery = (personPseudoId?: string, rettighetskategoriId?: string) =>
    useQuery(
        withDefaultQueryOptions({
            queryKey: getRettighetskategoriQueryKey(personPseudoId, rettighetskategoriId),
            queryFn: ({ signal }) =>
                getJson<Rettighetskategori>(
                    `/api/rettighetskategori/personer/${encodeURIComponent(personPseudoId!)}/rettighetskategorier/${encodeURIComponent(rettighetskategoriId!)}`,
                    { signal },
                ),
            enabled: !!personPseudoId && !!rettighetskategoriId,
        }),
    );

type ManuellVurderingRequest = {
    tilleggskategorier: Rettighetskategori['tilleggskategorier'];
    begrunnelse: string | null;
};

export function usePostManuellVurdering(personPseudoId: string, rettighetskategoriId: string) {
    return useMutation<Rettighetskategori, HttpError, ManuellVurderingRequest>({
        mutationFn: (body) =>
            postJson<Rettighetskategori>(
                `/api/rettighetskategori/personer/${encodeURIComponent(personPseudoId)}/rettighetskategorier/${encodeURIComponent(rettighetskategoriId)}/manuell-vurdering`,
                body,
            ),
    });
}
