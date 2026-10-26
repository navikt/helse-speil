import React, { ReactElement, ReactNode } from 'react';

import {
    ApiVilkårsgrunnlagInfotrygdV2,
    ApiVilkårsgrunnlagSpleisV2,
    ApiVilkårsgrunnlagVurdering,
} from '@io/rest/generated/spesialist.schemas';

import { VilkårsutfallKort } from './VilkårsutfallKort';
import { utfallFraOppfylt } from './vilkårsutfall';

interface MedlemskapVilkårProps {
    vilkårsgrunnlag: ApiVilkårsgrunnlagSpleisV2 | ApiVilkårsgrunnlagInfotrygdV2;
    vurdertTekst?: ReactNode;
}

export function MedlemskapVilkår({ vilkårsgrunnlag, vurdertTekst }: MedlemskapVilkårProps): ReactElement {
    return (
        <VilkårsutfallKort
            tittel="Lovvalg og medlemskap"
            utfall={utfallFraOppfylt(medlemskapOppfylt(vilkårsgrunnlag))}
            vurdertTekst={vurdertTekst}
        />
    );
}

function medlemskapOppfylt(
    vilkårsgrunnlag: ApiVilkårsgrunnlagSpleisV2 | ApiVilkårsgrunnlagInfotrygdV2,
): boolean | null {
    if (vilkårsgrunnlag.type === 'ApiVilkårsgrunnlagInfotrygdV2') {
        return true;
    }

    switch (vilkårsgrunnlag.vurderingAvKravOmMedlemskap) {
        case ApiVilkårsgrunnlagVurdering.OPPFYLT:
            return true;
        case ApiVilkårsgrunnlagVurdering.IKKE_OPPFYLT:
            return false;
        case ApiVilkårsgrunnlagVurdering.IKKE_VURDERT:
            return null;
    }
}
