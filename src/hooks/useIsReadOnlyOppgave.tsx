import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { useHarBeslutteroppgavetilgang } from '@hooks/useHarBeslutteroppgavetilgang';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useReadonly } from '@state/toggles';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useIsReadOnlyOppgave = (): boolean => {
    const { data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const periode = useActivePeriod(person);
    const erTidligereSaksbehandler = useErTidligereSaksbehandler();
    const harBeslutteroppgavetilgang = useHarBeslutteroppgavetilgang();

    if (!isBeregnetPeriode(periode) || !periode.totrinnsvurdering) {
        return false;
    }

    return (
        erTidligereSaksbehandler ||
        (periode.totrinnsvurdering?.erBeslutteroppgave === true && !harBeslutteroppgavetilgang)
    );
};
