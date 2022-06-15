import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useErBeslutteroppgaveOgHarTilgang } from '@hooks/useErBeslutteroppgaveOgHarTilgang';
import { toggleKanBeslutteEgenBeslutteroppgave } from '@state/toggles';
import { useRecoilValue } from 'recoil';

export const useErBeslutteroppgaveOgErTidligereSaksbehandler = (): boolean => {
    const activePeriod = useActivePeriod();
    const currentSaksbehandler = useInnloggetSaksbehandler();
    const erBeslutteroppgaveOgHarTilgang = useErBeslutteroppgaveOgHarTilgang();
    const kanBeslutteEgenBeslutteroppgave = useRecoilValue(toggleKanBeslutteEgenBeslutteroppgave);

    if (!isBeregnetPeriode(activePeriod)) {
        return false;
    }

    if (kanBeslutteEgenBeslutteroppgave) return false;
    return erBeslutteroppgaveOgHarTilgang && activePeriod.tidligereSaksbehandlerOid === currentSaksbehandler.oid;
};
