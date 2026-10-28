import { useHarBeslutteroppgavetilgang } from '@hooks/useHarBeslutteroppgavetilgang';
import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { useActivePeriod } from '@state/periode';
import { useTotrinnsvurderingForPeriode } from '@state/totrinnsvurdering';

export const useErBeslutteroppgaveOgHarTilgang = (person: ApiSaksbildePerson): boolean => {
    const periode = useActivePeriod(person);
    const totrinnsvurdering = useTotrinnsvurderingForPeriode(periode);
    const harBeslutteroppgaveTilgang = useHarBeslutteroppgavetilgang(person);

    return (totrinnsvurdering?.erBeslutteroppgave ?? false) && harBeslutteroppgaveTilgang;
};
