import { useInnloggetSaksbehandler } from '@state/authentication';
import { useActivePeriod } from '@state/periode';
import { useKanBeslutteEgneOppgaver } from '@state/toggles';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useErTidligereSaksbehandler = (): boolean => {
    const activePeriod = useActivePeriod();
    const currentSaksbehandler = useInnloggetSaksbehandler();
    const kanBeslutteEgenBeslutteroppgave = useKanBeslutteEgneOppgaver();

    if (!isBeregnetPeriode(activePeriod) || !activePeriod.oppgave) {
        return false;
    }

    if (kanBeslutteEgenBeslutteroppgave) return false;
    return (
        (activePeriod.oppgave.erBeslutter &&
            activePeriod.oppgave.tidligereSaksbehandler === currentSaksbehandler.oid) ||
        (activePeriod.oppgave.erRetur && activePeriod.beslutterSaksbehandlerOid === currentSaksbehandler.oid)
    );
};
