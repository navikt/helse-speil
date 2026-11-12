import { useParams } from 'next/navigation';

import { ApiKildetype, ApiMedlemskapsstatus } from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { useGetVilkårsvurderingerForPersonBehandler } from '@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger';
import { ApiBeregnetPeriode, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { getVilkårsgrunnlag } from '@state/utils';

export function useKreverIndividuellBegrunnelse(periode: ApiBeregnetPeriode, person: ApiSaksbildePerson): boolean {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const medlemskapsvurderingId = getVilkårsgrunnlag(person, periode.vilkarsgrunnlagId)?.medlemskapsvurderingId;

    // Samme query som vilkårsfanen bruker, så svaret deles via cachen
    const { data } = useGetVilkårsvurderingerForPersonBehandler(
        personPseudoId,
        { medlemskapsvurderingId: medlemskapsvurderingId ?? '' },
        { query: { enabled: medlemskapsvurderingId !== undefined } },
    );

    const vurdering = data?.krav[0];
    return vurdering?.status === ApiMedlemskapsstatus.NEI && vurdering.kilde.kildetype === ApiKildetype.SAKSBEHANDLER;
}
