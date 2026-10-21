import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { useHarBeslutteroppgavetilgang } from '@hooks/useHarBeslutteroppgavetilgang';
import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useIsReadOnlyOppgave = (person: ApiSaksbildePerson): boolean => {
    const periode = useActivePeriod(person);
    const erTidligereSaksbehandler = useErTidligereSaksbehandler(person);
    const harBeslutteroppgavetilgang = useHarBeslutteroppgavetilgang(person);

    if (!isBeregnetPeriode(periode) || !periode.totrinnsvurdering) {
        return false;
    }

    return erTidligereSaksbehandler || (periode.totrinnsvurdering?.erBeslutteroppgave && !harBeslutteroppgavetilgang);
};
