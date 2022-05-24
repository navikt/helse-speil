import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useBeslutterOppgaveIsEnabled } from '@hooks/useBeslutterOppgaveIsEnabled';

export const useErBeslutteroppgaveOgErTidligereSaksbehandler = (): boolean => {
    const activePeriod = useActivePeriod();
    const currentSaksbehandler = useInnloggetSaksbehandler();
    const isBeslutteroppgave = useBeslutterOppgaveIsEnabled();

    if (!isBeregnetPeriode(activePeriod)) {
        return false;
    }

    return isBeslutteroppgave && activePeriod.tidligereSaksbehandler === currentSaksbehandler.oid;
};
