import dayjs from 'dayjs';

import { erProd, erUtvikling } from '@/env';
import { customAxios } from '@app/axios/axiosClient';
import {
    ArsakerQueryResult,
    DialogmeldingMalerQueryResult,
    DriftsmeldingerQueryResult,
    InformasjonsmeldingerQueryResult,
    NyheterQueryResult,
    SkjonnsfastsettelseMalerQueryResult,
} from '@io/sanity/generated/sanity.types';
import { useQuery } from '@tanstack/react-query';

export type SanityResponse<T> = { result: T };

export function useSkjønnsfastsettelsesMaler(skalVise828AndreLedd: boolean, harFlereArbeidsgivere: boolean) {
    const {
        data,
        error,
        isPending: loading,
    } = useQuery({
        queryKey: ['sanity', 'skjønnsfastsettelsesMaler'],
        queryFn: async (): Promise<SanityResponse<SkjonnsfastsettelseMalerQueryResult>> =>
            (await customAxios.get('/api/sanity/skjonnsfastsettelse-maler')).data,
        staleTime: Infinity,
        gcTime: 0,
    });

    return {
        maler: data
            ? filterRelevantMaler(data.result, {
                  skalVise828AndreLedd,
                  arbeidsforholdMal: harFlereArbeidsgivere ? 'FLERE_ARBEIDSGIVERE' : 'EN_ARBEIDSGIVER',
              })
            : undefined,
        loading,
        error,
    };
}

/**
 * Returnerer *aktive* driftsmeldinger, det vil si at "ferdigstilte" driftsmeldinger som kommer tilbake fra sanity blir
 * filtrert vekk.
 */
export function useDriftsmelding() {
    const {
        data,
        error,
        isPending: loading,
    } = useQuery({
        queryKey: ['sanity', 'driftsmeldinger'],
        queryFn: async (): Promise<SanityResponse<DriftsmeldingerQueryResult>> =>
            (await customAxios.get('/api/sanity/driftsmeldinger')).data,
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
        gcTime: 0,
    });

    const aktiveDriftsmeldinger =
        data?.result
            .filter((it) => !erProd || it.iProd === 'true')
            .filter((it) => !erUtvikling || it.iDev === 'true')
            .filter(
                (driftsmelding) =>
                    !(
                        dayjs(driftsmelding._updatedAt).add(30, 'minutes').isBefore(dayjs()) &&
                        driftsmelding.lost === 'true'
                    ),
            ) ?? [];

    return {
        driftsmeldinger: aktiveDriftsmeldinger,
        loading,
        error,
    };
}

export function useInformasjonsmelding() {
    const {
        data,
        error,
        isPending: loading,
    } = useQuery({
        queryKey: ['sanity', 'informasjonsmeldinger'],
        queryFn: async (): Promise<SanityResponse<InformasjonsmeldingerQueryResult>> =>
            (await customAxios.get('/api/sanity/informasjonsmeldinger')).data,
        staleTime: Infinity,
        gcTime: 0,
    });

    const aktiveInformasjonsmeldinger =
        data?.result
            .filter((it) => !erProd || it.iProd === 'true')
            .filter((it) => !erUtvikling || it.iDev === 'true')
            .filter((informasjonsmelding) => dayjs(informasjonsmelding.synligTil).isAfter(dayjs())) ?? [];

    return {
        informasjonsmeldinger: aktiveInformasjonsmeldinger,
        loading,
        error,
    };
}

export function useArsaker(id: string) {
    const {
        data,
        error,
        isPending: loading,
    } = useQuery({
        queryKey: ['sanity', 'årsaker', id],
        queryFn: async (): Promise<SanityResponse<ArsakerQueryResult>> =>
            (await customAxios.get(`/api/sanity/arsaker/${id}`)).data,
        staleTime: Infinity,
        gcTime: 0,
    });

    return {
        arsaker: data?.result ?? [],
        loading,
        error,
    };
}

export function useNyheter() {
    const {
        data,
        error,
        isPending: loading,
    } = useQuery({
        queryKey: ['sanity', 'nyheter'],
        queryFn: async (): Promise<SanityResponse<NyheterQueryResult>> =>
            (await customAxios.get('/api/sanity/nyheter')).data,
        staleTime: Infinity,
        gcTime: 0,
    });

    const nyheter = data?.result.filter((it) => (erProd ? it.iProd : true)) ?? [];

    return {
        nyheter,
        loading,
        error,
    };
}

export function useDialogmeldingMaler() {
    const { data, error, isPending, refetch } = useQuery({
        queryKey: ['sanity', 'dialogmeldingMaler'],
        queryFn: async (): Promise<SanityResponse<DialogmeldingMalerQueryResult>> =>
            (await customAxios.get('/api/sanity/dialogmelding-maler')).data,
        staleTime: Infinity,
        gcTime: 0,
    });

    return {
        maler: data?.result.filter((it) => (erProd ? it.iProd : true)) ?? [],
        isPending,
        error,
        refetch,
    };
}

function filterRelevantMaler(
    sanityResult: SkjonnsfastsettelseMalerQueryResult,
    opts: {
        skalVise828AndreLedd: boolean;
        arbeidsforholdMal: 'EN_ARBEIDSGIVER' | 'FLERE_ARBEIDSGIVERE';
    },
): SkjonnsfastsettelseMalerQueryResult {
    return sanityResult
        .filter((it) => (!opts.skalVise828AndreLedd ? it.lovhjemmel?.ledd !== '2' : true))
        .filter((it) => it.arbeidsforholdMal?.includes(opts.arbeidsforholdMal))
        .filter((it) => (erProd ? it.iProd : true));
}
