import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { useHarBeslutteroppgavetilgang } from '@hooks/useHarBeslutteroppgavetilgang';
import { useReadonly, useReadonlyOverride } from '@state/toggles';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useIsReadOnlyOppgave = (): boolean => {
    const periode = useActivePeriod();
    const erTidligereSaksbehandler = useErTidligereSaksbehandler();
    const harBeslutteroppgavetilgang = useHarBeslutteroppgavetilgang();

    const readOnly = useReadonly();
    const readOnlyOverride = useReadonlyOverride();

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    if (readOnlyOverride) {
        return readOnly;
    }

    return erTidligereSaksbehandler || (periode.erBeslutterOppgave && !harBeslutteroppgavetilgang);
};
