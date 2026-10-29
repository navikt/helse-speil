import { useParams } from 'next/navigation';

import { useGetArbeidsforholdForPerson } from '@io/rest/generated/personer/personer';
import { ApiArbeidsforholdForPerson } from '@io/rest/generated/spesialist.schemas';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { isArbeidsgiver } from '@utils/typeguards';

export const useArbeidsforholdQuery = () => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    return useGetArbeidsforholdForPerson(personPseudoId!, { query: { enabled: !!personPseudoId } });
};

export const finnArbeidsforholdForInntektsforhold = (
    arbeidsforhold: ApiArbeidsforholdForPerson[],
    inntektsforhold: Inntektsforhold,
): ApiArbeidsforholdForPerson[] =>
    isArbeidsgiver(inntektsforhold)
        ? arbeidsforhold.filter((it) => it.organisasjonsnummer === inntektsforhold.organisasjonsnummer)
        : [];

export const useArbeidsforholdForInntektsforhold = (inntektsforhold: Inntektsforhold): ApiArbeidsforholdForPerson[] =>
    finnArbeidsforholdForInntektsforhold(useArbeidsforholdQuery().data ?? [], inntektsforhold);
