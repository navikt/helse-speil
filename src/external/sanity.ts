import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';

import { erLokal, erProd, erUtvikling } from '@/env';
import { customAxios } from '@app/axios/axiosClient';
import { PortableTextBlock } from '@portabletext/react';
import { useQuery } from '@tanstack/react-query';
import { Lovhjemmel } from '@typer/overstyring';
import { DateString } from '@typer/shared';

export type ArbeidsforholdMal = 'EN_ARBEIDSGIVER' | 'FLERE_ARBEIDSGIVERE';

export interface SkjønnsfastsettingMal {
    _id: string;
    begrunnelse: string;
    konklusjon: string;
    arsak: string;
    iProd: boolean;
    lovhjemmel: Lovhjemmel;
    arbeidsforholdMal: ArbeidsforholdMal[];
}

export interface Driftsmelding {
    _id: string;
    _rev: string;
    iProd: 'true' | 'false';
    iDev: 'true' | 'false';
    lost: 'true' | 'false';
    konsekvens: string;
    arsak: string;
    tiltak: string;
    oppdatering: string;
    cta: string;
    _updatedAt: DateString;
    _createdAt: DateString;
}

export interface Arsaker {
    _id: string;
    arsaker: Arsak[];
}

export interface Arsak {
    _key: string;
    arsak: string;
}

export type NyhetType = {
    _id: string;
    _createdAt: string;
    iProd: boolean;
    tittel: string;
    beskrivelse: PortableTextBlock[];
    dato: DateString;
    lenke: Lenke | null;
    modal: NyhetModalType;
};

type Lenke = {
    lenkeTekst: string;
    lenkeUrl: string;
};

export type NyhetModalType = {
    antallSlides: number;
    tvungenModal: boolean;
    modalOverskrift: string;
    modalSlide1: NyhetModalSlide | null;
    modalSlide2: NyhetModalSlide | null;
    modalSlide3: NyhetModalSlide | null;
};

type NyhetModalSlide = {
    slideOverskrift: string;
    altTekst: string;
    bildeUrl: string;
    slideBeskrivelse: PortableTextBlock[];
};

type SkjønnsfastsettelseMalerQueryResult = {
    result: SkjønnsfastsettingMal[];
};

type DriftsmeldingerQueryResult = {
    result: Driftsmelding[];
};

type ArsakerQueryResult = {
    result: Arsaker[];
};

type NyheterQueryResult = {
    result: NyhetType[];
};

const SANITY_URL = 'https://z9kr8ddn.api.sanity.io/v2023-08-01/data/query/production';

export function useSkjønnsfastsettelsesMaler(skalVise828AndreLedd: boolean, harFlereArbeidsgivere: boolean) {
    const {
        data,
        error,
        isPending: loading,
    } = useQuery({
        queryKey: ['sanity', 'skjønnsfastsettelsesMaler'],
        queryFn: async (): Promise<AxiosResponse<SkjønnsfastsettelseMalerQueryResult>> =>
            customAxios.post(SANITY_URL, {
                query: `*[_type == "skjonnsfastsettelseMal"]`,
            }),
        staleTime: Infinity,
        gcTime: 0,
    });

    return {
        maler: data
            ? filterRelevantMaler(data.data.result, {
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
        queryFn: async (): Promise<AxiosResponse<DriftsmeldingerQueryResult>> =>
            customAxios.post(SANITY_URL, {
                query: `*[_type == "driftsmelding"]`,
            }),
        staleTime: Infinity,
        gcTime: 0,
    });

    const aktiveDriftsmeldinger =
        data?.data?.result
            .filter((it: Driftsmelding) => !erProd || it.iProd === 'true')
            .filter((it: Driftsmelding) => !erUtvikling || it.iDev === 'true')
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

export function useArsaker(id: string) {
    const {
        data,
        error,
        isPending: loading,
    } = useQuery({
        queryKey: ['sanity', 'årsaker', id],
        queryFn: async (): Promise<AxiosResponse<ArsakerQueryResult>> =>
            customAxios.post(SANITY_URL, {
                query: `*[_type == "arsaker" && _id == "${id}"]`,
            }),
        staleTime: Infinity,
        gcTime: 0,
    });

    return {
        arsaker: data?.data?.result ?? [],
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
        queryFn: async (): Promise<AxiosResponse<NyheterQueryResult>> =>
            customAxios.post(SANITY_URL, {
                query: `*[_type == "nyhet"]{
                    _id,
                    _createdAt,
                    iProd,
                    tittel,
                    beskrivelse,
                    dato,
                    lenke {
                        lenkeTekst,
                        lenkeUrl
                    },
                    modal {
                        antallSlides,
                        tvungenModal,
                        modalOverskrift,
                        modalSlide1 {
                            slideOverskrift,
                            altTekst,
                            "bildeUrl": slideBilde.asset->url,
                            slideBeskrivelse
                        },
                        modalSlide2 {
                            slideOverskrift,
                            altTekst,
                            "bildeUrl": slideBilde.asset->url,
                            slideBeskrivelse
                        },
                        modalSlide3 {
                            slideOverskrift,
                            altTekst,
                            "bildeUrl": slideBilde.asset->url,
                            slideBeskrivelse
                        }
                    }
                } | order(_createdAt desc)`,
            }),
        staleTime: Infinity,
        gcTime: 0,
    });

    const nyheter =
        data?.data?.result
            .filter((it: NyhetType) => (erProd ? it.iProd : true))
            .filter((it: NyhetType) => (erLokal ? !it.modal?.tvungenModal : true)) ?? [];

    return {
        nyheter,
        loading,
        error,
    };
}

function filterRelevantMaler(
    sanityResult: SkjønnsfastsettingMal[],
    opts: {
        skalVise828AndreLedd: boolean;
        arbeidsforholdMal: ArbeidsforholdMal;
    },
): SkjønnsfastsettingMal[] {
    return sanityResult
        .filter((it: SkjønnsfastsettingMal) => (!opts.skalVise828AndreLedd ? it.lovhjemmel.ledd !== '2' : true))
        .filter((it: SkjønnsfastsettingMal) => it.arbeidsforholdMal.includes(opts.arbeidsforholdMal))
        .filter((it: SkjønnsfastsettingMal) => (erProd ? it.iProd : true));
}
