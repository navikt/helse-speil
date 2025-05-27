import { PersonFragment } from '@io/graphql';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useHarTotrinnsvurdering = (person: PersonFragment | null) =>
    person?.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [])
        .some((periode) => isBeregnetPeriode(periode) && periode.totrinnsvurdering?.erBeslutteroppgave) ?? false;
