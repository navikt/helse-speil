import { useHarBeslutteroppgavetilgang } from '@hooks/useHarBeslutteroppgavetilgang';
import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useErBeslutteroppgaveOgHarTilgang = (person: ApiSaksbildePerson): boolean => {
    const periode = useActivePeriod(person);
    const harBeslutteroppgaveTilgang = useHarBeslutteroppgavetilgang(person);

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    return (periode.totrinnsvurdering?.erBeslutteroppgave ?? false) && harBeslutteroppgaveTilgang;
};
