import dayjs from 'dayjs';

import { erProd, erUtvikling } from '@/env';
import { gql, useQuery } from '@apollo/client';
import { Maybe } from '@io/graphql';
import { PortableTextBlock } from '@portabletext/react';
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
    lenke: Maybe<Lenke>;
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
    modalSlide1: Maybe<NyhetModalSlide>;
    modalSlide2: Maybe<NyhetModalSlide>;
    modalSlide3: Maybe<NyhetModalSlide>;
};

type NyhetModalSlide = {
    slideOverskrift: string;
    altTekst: string;
    bildeUrl: string;
    slideBeskrivelse: PortableTextBlock[];
};

type SkjønnsfastsettelseMalerQueryResult = {
    sanity: {
        result: SkjønnsfastsettingMal[];
    };
};

type DriftsmeldingerQueryResult = {
    sanity: {
        result: Driftsmelding[];
    };
};

type ArsakerQueryResult = {
    sanity: {
        result: Arsaker[];
    };
};

type NyheterQueryResult = {
    sanity: {
        result: NyhetType[];
    };
};

type SanityQueryVariables = {
    input: {
        query: string;
    };
};

export function useSkjønnsfastsettelsesMaler(skalVise828AndreLedd: boolean, harFlereArbeidsgivere: boolean) {
    const { data, error, loading } = useQuery<SkjønnsfastsettelseMalerQueryResult, SanityQueryVariables>(
        gql`
            query SkjonnsfastsettelsesMaler($input: QueryPayload!) {
                sanity(input: $input)
                    @rest(
                        type: "SkjonnsfastsettelsesMalResult"
                        endpoint: "sanity"
                        path: ""
                        method: "POST"
                        bodyKey: "input"
                    ) {
                    result
                }
            }
        `,
        {
            variables: {
                input: { query: `*[_type == "skjonnsfastsettelseMal"]` },
            },
        },
    );

    return {
        maler: data
            ? filterRelevantMaler(data.sanity.result, {
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
    const { data, error, loading } = useQuery<DriftsmeldingerQueryResult, SanityQueryVariables>(
        gql`
            query Driftsmelding($input: QueryPayload!) {
                sanity(input: $input)
                    @rest(type: "DriftsmeldingResult", endpoint: "sanity", path: "", method: "POST", bodyKey: "input") {
                    result
                }
            }
        `,
        {
            variables: { input: { query: `*[_type == "driftsmelding"]` } },
        },
    );

    const aktiveDriftsmeldinger =
        data?.sanity?.result
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
    const { data, error, loading } = useQuery<ArsakerQueryResult, SanityQueryVariables>(
        gql`
            query Arsaker($input: QueryPayload!) {
                sanity(input: $input)
                    @rest(type: "ArsakerResult", endpoint: "sanity", path: "", method: "POST", bodyKey: "input") {
                    result
                }
            }
        `,
        {
            variables: {
                input: { query: `*[_type == "arsaker" && _id == "${id}"]` },
            },
        },
    );

    return {
        arsaker: data?.sanity?.result ?? [],
        loading,
        error,
    };
}

export function useNyheter() {
    const { data, error, loading } = useQuery<NyheterQueryResult, SanityQueryVariables>(
        gql`
            query Nyhet($input: QueryPayload!) {
                sanity(input: $input)
                    @rest(type: "NyhetResult", endpoint: "sanity", path: "", method: "POST", bodyKey: "input") {
                    result
                }
            }
        `,
        {
            variables: {
                input: {
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
                },
            },
        },
    );

    return {
        nyheter: data?.sanity?.result.filter((it: NyhetType) => (erProd ? it.iProd : true)) ?? [],
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
