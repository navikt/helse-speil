import { erProd } from '@/env';
import { gql, useQuery } from '@apollo/client';
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
    iProd: boolean;
    level: 'info' | 'warning' | 'error' | 'success';
    tittel: string;
    melding: string;
    opprettet: DateString;
    _updatedAt: DateString;
}

export interface Arsaker {
    _id: string;
    arsaker: Arsak[];
}

export interface Arsak {
    _key: string;
    arsak: string;
}

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
            variables: {
                input: { query: `*[_type == "driftsmelding" && solved != true]` },
            },
        },
    );

    return {
        driftsmeldinger: data?.sanity?.result.filter((it: Driftsmelding) => (erProd ? it.iProd : true)) ?? [],
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
