import { OppgaveForPeriodevisning, Totrinnsvurdering } from '@io/graphql';
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

    const gammelTotrinnsvurdering = (oppgave: OppgaveForPeriodevisning): boolean => {
        const erOrginalSaksbehandler = oppgave.tidligereSaksbehandler === currentSaksbehandler.oid;
        const erBesluttersaksbehandler = activePeriod.beslutterSaksbehandlerOid === currentSaksbehandler.oid;

        return (oppgave.erBeslutter && erOrginalSaksbehandler) || (oppgave.erRetur && erBesluttersaksbehandler);
    };

    const nyTotrinnsvurdering = (totrinnsvurdering?: Maybe<Totrinnsvurdering>): boolean => {
        if (!totrinnsvurdering) return false;

        const erOrginalSaksbehandler = totrinnsvurdering.saksbehandler === currentSaksbehandler.oid;
        const erBesluttersaksbehandler = totrinnsvurdering.beslutter === currentSaksbehandler.oid;

        return (
            (totrinnsvurdering.erBeslutteroppgave && erOrginalSaksbehandler) ||
            (totrinnsvurdering.erRetur && erBesluttersaksbehandler)
        );
    };

    return gammelTotrinnsvurdering(activePeriod.oppgave) || nyTotrinnsvurdering(activePeriod.totrinnsvurdering);
};
