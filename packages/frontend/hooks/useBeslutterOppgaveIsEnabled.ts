import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';
import { beslutteroppgaveAktiv } from '@utils/featureToggles';

export const useBeslutterOppgaveIsEnabled = (): boolean => {
    const periode = useActivePeriod();

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    // Når vi skrur på toggle kan vi bytte ut beslutteroppgaveAktiv med harBeslutterRolle
    return beslutteroppgaveAktiv && periode.erBeslutterOppgave;
};
