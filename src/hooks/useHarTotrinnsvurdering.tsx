import { PersonFragment } from '@io/graphql';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useHarTotrinnsvurdering = (person: PersonFragment | null) =>
    finnAlleInntektsforhold(person)
        .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [])
        .some((periode) => isBeregnetPeriode(periode) && periode.totrinnsvurdering?.erBeslutteroppgave) ?? false;
