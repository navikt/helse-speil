import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { useHarBeslutteroppgavetilgang } from '@hooks/useHarBeslutteroppgavetilgang';
import { useReadonly } from '@state/toggles';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useIsReadOnlyOppgave = (): boolean => {
    const periode = useActivePeriod();
    const erTidligereSaksbehandler = useErTidligereSaksbehandler();
    const harBeslutteroppgavetilgang = useHarBeslutteroppgavetilgang();

    const readOnly = useReadonly();

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    if (readOnly.override) {
        return readOnly.value;
    }

    return erTidligereSaksbehandler || (periode.erBeslutterOppgave && !harBeslutteroppgavetilgang);
};
