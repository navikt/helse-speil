import { useActivePeriod } from '@state/periode';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useKanBeslutteEgneOppgaver } from '@state/toggles';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useErTidligereSaksbehandler = (): boolean => {
    const activePeriod = useActivePeriod();
    const currentSaksbehandler = useInnloggetSaksbehandler();
    const kanBeslutteEgenBeslutteroppgave = useKanBeslutteEgneOppgaver();

    if (!isBeregnetPeriode(activePeriod)) {
        return false;
    }

    if (kanBeslutteEgenBeslutteroppgave) return false;
    return activePeriod.tidligereSaksbehandlerOid === currentSaksbehandler.oid;
};
