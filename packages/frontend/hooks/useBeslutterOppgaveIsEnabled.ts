import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';
import { erBeslutterOppgave } from '@utils/featureToggles';

export const useBeslutterOppgaveIsEnabled = (): boolean => {
    const periode = useActivePeriod();

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    return erBeslutterOppgave && periode.erBeslutterOppgave;
};
