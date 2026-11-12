import { ApiDag, ApiLøpendeVilkår, ApiSykdomsdagtype } from '@io/rest/generated/spesialist.schemas';
import { DateString } from '@typer/shared';

export const manglerVurderingAvOppholdskravTekst =
    'Du må vurdere oppholdskravet for dagene med opphold utenfor EØS før du kan godkjenne.';

export function harVurderingAvOppholdskrav(dag: ApiDag): boolean {
    return (
        dag.vurderingerAvLøpendeVilkår?.some((vurdering) => vurdering.vilkår === ApiLøpendeVilkår.OPPHOLDSKRAV) ?? false
    );
}

// Samme regel som Spleis bruker for dagerUtenVurderingAvOppholdskrav i godkjenningsbehovet. Utfallet spiller ingen rolle.
export function dagerUtenVurderingAvOppholdskrav(tidslinje: ApiDag[]): DateString[] {
    return tidslinje
        .filter((dag) => dag.sykdomsdagtype === ApiSykdomsdagtype.SYK_UTENFOR_EOS && !harVurderingAvOppholdskrav(dag))
        .map((dag) => dag.dato);
}
