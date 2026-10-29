import { useParams } from 'next/navigation';

import { useGetInntekterFraAordningenForPerson } from '@io/rest/generated/personer/personer';
import {
    ApiInntektFraAOrdningen,
    ApiInntekterFraAordningenForArbeidsgiver,
} from '@io/rest/generated/spesialist.schemas';
import { DateString } from '@typer/shared';

export const finnInntekterFraAordningen = (
    inntekter: ApiInntekterFraAordningenForArbeidsgiver[],
    organisasjonsnummer: string,
    skjæringstidspunkt: DateString,
): ApiInntektFraAOrdningen[] | undefined =>
    inntekter.find(
        (it) => it.organisasjonsnummer === organisasjonsnummer && it.skjaeringstidspunkt === skjæringstidspunkt,
    )?.inntekter;

// Lastes først når sykepengegrunnlaget vises
export const useInntekterFraAordningen = (
    organisasjonsnummer: string,
    skjæringstidspunkt: DateString,
): ApiInntektFraAOrdningen[] | undefined => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const { data } = useGetInntekterFraAordningenForPerson(personPseudoId!, { query: { enabled: !!personPseudoId } });
    return data ? finnInntekterFraAordningen(data, organisasjonsnummer, skjæringstidspunkt) : undefined;
};
