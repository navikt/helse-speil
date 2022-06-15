import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useBeslutterOppgaveIsEnabled } from '@hooks/useBeslutterOppgaveIsEnabled';
import { toggleKanBeslutteEgenBeslutteroppgave } from '@state/toggles';
import { useRecoilValue } from 'recoil';

export const useErBeslutteroppgaveOgErTidligereSaksbehandler = (): boolean => {
    const activePeriod = useActivePeriod();
    const currentSaksbehandler = useInnloggetSaksbehandler();
    const isBeslutteroppgave = useBeslutterOppgaveIsEnabled();
    const kanBeslutteEgenBeslutteroppgave = useRecoilValue(toggleKanBeslutteEgenBeslutteroppgave);

    if (!isBeregnetPeriode(activePeriod)) {
        return false;
    }

    if (kanBeslutteEgenBeslutteroppgave) return false;
    return isBeslutteroppgave && activePeriod.tidligereSaksbehandlerOid === currentSaksbehandler.oid;
};
