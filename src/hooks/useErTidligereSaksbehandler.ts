import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useActivePeriod } from '@state/periode';
import { useKanBeslutteEgneOppgaver } from '@state/toggles';
import { useTotrinnsvurderingForPeriode } from '@state/totrinnsvurdering';

export const useErTidligereSaksbehandler = (person: ApiSaksbildePerson): boolean => {
    const activePeriod = useActivePeriod(person);
    const currentSaksbehandler = useInnloggetSaksbehandler();
    const kanBeslutteEgenBeslutteroppgave = useKanBeslutteEgneOppgaver();
    const totrinnsvurdering = useTotrinnsvurderingForPeriode(activePeriod);

    if (kanBeslutteEgenBeslutteroppgave) return false;

    if (!totrinnsvurdering) return false;

    const erOrginalSaksbehandler = totrinnsvurdering.saksbehandler === currentSaksbehandler.oid;
    const erBesluttersaksbehandler = totrinnsvurdering.beslutter === currentSaksbehandler.oid;

    return (
        (totrinnsvurdering.erBeslutteroppgave && erOrginalSaksbehandler) ||
        (totrinnsvurdering.erRetur && erBesluttersaksbehandler)
    );
};
