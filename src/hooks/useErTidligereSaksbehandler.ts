import { useInnloggetSaksbehandler } from '@state/authentication';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useKanBeslutteEgneOppgaver } from '@state/toggles';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useErTidligereSaksbehandler = (): boolean => {
    const { data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const activePeriod = useActivePeriod(person);
    const currentSaksbehandler = useInnloggetSaksbehandler();
    const kanBeslutteEgenBeslutteroppgave = useKanBeslutteEgneOppgaver();

    if (!isBeregnetPeriode(activePeriod)) {
        return false;
    }

    if (kanBeslutteEgenBeslutteroppgave) return false;

    const totrinnsvurdering = activePeriod.totrinnsvurdering;
    if (!totrinnsvurdering) return false;

    const erOrginalSaksbehandler = totrinnsvurdering.saksbehandler === currentSaksbehandler.oid;
    const erBesluttersaksbehandler = totrinnsvurdering.beslutter === currentSaksbehandler.oid;

    return (
        (totrinnsvurdering.erBeslutteroppgave && erOrginalSaksbehandler) ||
        (totrinnsvurdering.erRetur && erBesluttersaksbehandler)
    );
};
