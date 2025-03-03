import { useHarBeslutteroppgavetilgang } from '@hooks/useHarBeslutteroppgavetilgang';
import { PersonFragment } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useErBeslutteroppgaveOgHarTilgang = (person: PersonFragment): boolean => {
    const periode = useActivePeriod(person);
    const harBeslutteroppgaveTilgang = useHarBeslutteroppgavetilgang(person);

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    return (periode.totrinnsvurdering?.erBeslutteroppgave ?? false) && harBeslutteroppgaveTilgang;
};
