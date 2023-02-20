import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { useHarBeslutteroppgavetilgang } from '@hooks/useHarBeslutteroppgavetilgang';
import { useActivePeriod } from '@state/periode';
import { useReadonly } from '@state/toggles';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useIsReadOnlyOppgave = (): boolean => {
    const periode = useActivePeriod();
    const erTidligereSaksbehandler = useErTidligereSaksbehandler();
    const harBeslutteroppgavetilgang = useHarBeslutteroppgavetilgang();

    const readOnly = useReadonly();

    if (!isBeregnetPeriode(periode) || !periode.oppgave) {
        return false;
    }

    if (readOnly.override) {
        return readOnly.value;
    }

    return erTidligereSaksbehandler || (periode.oppgave.erBeslutter && !harBeslutteroppgavetilgang);
};
