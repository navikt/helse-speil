import { erProd } from '@/env';
import { Lovhjemmel } from '@/routes/saksbilde/sykepengegrunnlag/overstyring/overstyring.types';
import { gql, useQuery } from '@apollo/client';

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

type SanityQueryResult = {
    sanity: {
        result: SkjønnsfastsettingMal[];
    };
};

type SanityQueryVariables = {
    input: {
        query: string;
    };
};

export function useSkjønnsfastsettelsesMaler(avviksprosent: number, harFlereArbeidsgivere: boolean) {
    const { data, error, loading } = useQuery<SanityQueryResult, SanityQueryVariables>(
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
                  avviksprosent,
                  arbeidsforholdMal: harFlereArbeidsgivere ? 'FLERE_ARBEIDSGIVERE' : 'EN_ARBEIDSGIVER',
              })
            : undefined,
        loading,
        error,
    };
}

function filterRelevantMaler(
    sanityResult: SkjønnsfastsettingMal[],
    opts: {
        avviksprosent: number;
        arbeidsforholdMal: ArbeidsforholdMal;
    },
): SkjønnsfastsettingMal[] {
    return sanityResult
        .filter((it: SkjønnsfastsettingMal) => (opts.avviksprosent <= 25 ? it.lovhjemmel.ledd !== '2' : true))
        .filter((it: SkjønnsfastsettingMal) => it.arbeidsforholdMal.includes(opts.arbeidsforholdMal))
        .filter((it: SkjønnsfastsettingMal) => (erProd ? it.iProd : true));
}
