import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { Redigering, redigeringISykefraværstilfellet } from '@state/sykefraværstilfelle';
import { useNyttSaksbildeoppsett } from '@state/toggles';
import { useTotrinnsvurdering } from '@state/totrinnsvurdering';

/**
 * Med det nye saksbildeoppsettet avhenger redigeringen i Sykepengegrunnlag og Inngangsvilkår av grunnlaget som vises,
 * ikke av den valgte perioden. Gir null med toggelen av, og da gjelder dagens regler.
 */
export function useRedigeringISykefraværstilfellet(
    person: ApiSaksbildePerson,
    vilkårsgrunnlagId: string | null | undefined,
): Redigering | null {
    const nyttSaksbildeoppsett = useNyttSaksbildeoppsett();
    const venterPåBeslutter = useTotrinnsvurdering()?.erBeslutteroppgave ?? false;
    if (!nyttSaksbildeoppsett) return null;
    return redigeringISykefraværstilfellet(person, vilkårsgrunnlagId ?? null, venterPåBeslutter);
}
