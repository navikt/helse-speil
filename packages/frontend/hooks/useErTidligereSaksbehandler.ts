import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';
import { useInnloggetSaksbehandler } from '@state/authentication';

export const useErTidligereSaksbehandler = (): boolean => {
    const activePeriod = useActivePeriod();
    const currentSaksbehandler = useInnloggetSaksbehandler();

    if (!isBeregnetPeriode(activePeriod)) {
        return false;
    }

    return activePeriod.tidligereSaksbehandlerOid === currentSaksbehandler.oid;
};
