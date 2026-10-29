import { useParams } from 'next/navigation';

import { useGetOverstyringerForPerson } from '@io/rest/generated/personer/personer';
import { ApiOverstyring } from '@io/rest/generated/spesialist.schemas';
import type { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { isArbeidsgiver } from '@utils/typeguards';

// Spesialist lagrer overstyringer for selvstendig næringsdrivende med dette organisasjonsnummeret
const SELVSTENDIG_ORGANISASJONSNUMMER = 'SELVSTENDIG';

const ingenOverstyringer: ApiOverstyring[] = [];

export const useOverstyringerQuery = () => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    return useGetOverstyringerForPerson(personPseudoId!, { query: { enabled: !!personPseudoId } });
};

export const useOverstyringer = (): ApiOverstyring[] =>
    useOverstyringerQuery().data?.overstyringer ?? ingenOverstyringer;

export const finnOverstyringerForInntektsforhold = (
    overstyringer: ApiOverstyring[],
    inntektsforhold?: Inntektsforhold | null,
): ApiOverstyring[] => {
    if (!inntektsforhold) return [];
    const organisasjonsnummer = isArbeidsgiver(inntektsforhold)
        ? inntektsforhold.organisasjonsnummer
        : SELVSTENDIG_ORGANISASJONSNUMMER;
    return overstyringer.filter((it) => it.organisasjonsnummer === organisasjonsnummer);
};

export const useOverstyringerForInntektsforhold = (inntektsforhold?: Inntektsforhold | null): ApiOverstyring[] =>
    finnOverstyringerForInntektsforhold(useOverstyringer(), inntektsforhold);
