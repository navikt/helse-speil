import { useHarBeslutteroppgavetilgang } from '@hooks/useHarBeslutteroppgavetilgang';
import { PersonFragment } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useTotrinnsvurderingErAktiv } from '@state/toggles';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useErBeslutteroppgaveOgHarTilgang = (person: PersonFragment): boolean => {
    const periode = useActivePeriod(person);
    const totrinnvurderingAktiv = useTotrinnsvurderingErAktiv();
    const harBeslutteroppgaveTilgang = useHarBeslutteroppgavetilgang(person);

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    return (
        totrinnvurderingAktiv && (periode.totrinnsvurdering?.erBeslutteroppgave ?? false) && harBeslutteroppgaveTilgang
    );
};
