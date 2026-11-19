import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { ApiBeregnetPeriode, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { useTotrinnsvurderingForPeriode } from '@state/totrinnsvurdering';

// Beslutter skal ikke vurdere inngangsvilkår, bare godkjenne eller sende i retur
export function useInngangsvilkårErReadOnly(person: ApiSaksbildePerson, periode: ApiBeregnetPeriode): boolean {
    const readOnly = useIsReadOnlyOppgave(person);
    const erBeslutteroppgave = useTotrinnsvurderingForPeriode(periode)?.erBeslutteroppgave ?? false;
    return readOnly || erBeslutteroppgave;
}
