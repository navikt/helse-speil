import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useHarTotrinnsvurdering = (person: ApiSaksbildePerson | null) =>
    finnAlleInntektsforhold(person)
        .flatMap((arbeidsgiver) => arbeidsgiver.behandlinger[0]?.perioder ?? [])
        .some((periode) => isBeregnetPeriode(periode) && periode.totrinnsvurdering?.erBeslutteroppgave) ?? false;
