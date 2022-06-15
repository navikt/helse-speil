import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';
import { toggleBeslutteroppgaveAktiv } from '@state/toggles';
import { useRecoilValue } from 'recoil';

export const useBeslutterOppgaveIsEnabled = (): boolean => {
    const periode = useActivePeriod();
    const beslutteroppgaveAktiv = useRecoilValue(toggleBeslutteroppgaveAktiv);

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    // Når vi skrur på toggle kan vi bytte ut beslutteroppgaveAktiv med harBeslutterRolle
    return beslutteroppgaveAktiv && periode.erBeslutterOppgave;
};
