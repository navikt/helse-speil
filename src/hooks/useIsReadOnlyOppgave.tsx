import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { useHarBeslutteroppgavetilgang } from '@hooks/useHarBeslutteroppgavetilgang';
import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { useActivePeriod } from '@state/periode';
import { useTotrinnsvurderingForPeriode } from '@state/totrinnsvurdering';

export const useIsReadOnlyOppgave = (person: ApiSaksbildePerson): boolean => {
    const periode = useActivePeriod(person);
    const totrinnsvurdering = useTotrinnsvurderingForPeriode(periode);
    const erTidligereSaksbehandler = useErTidligereSaksbehandler(person);
    const harBeslutteroppgavetilgang = useHarBeslutteroppgavetilgang(person);

    if (!totrinnsvurdering) {
        return false;
    }

    return erTidligereSaksbehandler || (totrinnsvurdering.erBeslutteroppgave && !harBeslutteroppgavetilgang);
};
