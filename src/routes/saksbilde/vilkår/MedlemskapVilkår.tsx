import React, { ReactElement } from 'react';

import { VilkarsgrunnlagInfotrygdV2, VilkarsgrunnlagSpleisV2, VilkarsgrunnlagVurdering } from '@io/graphql';

import { VilkårsutfallKort } from './VilkårsutfallKort';
import { utfallFraOppfylt } from './vilkårsutfall';

interface MedlemskapVilkårProps {
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2;
    vurdertTekst?: string;
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

function medlemskapOppfylt(vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2): boolean | null {
    if (vilkårsgrunnlag.__typename === 'VilkarsgrunnlagInfotrygdV2') {
        return true;
    }

    switch (vilkårsgrunnlag.vurderingAvKravOmMedlemskap) {
        case VilkarsgrunnlagVurdering.Oppfylt:
            return true;
        case VilkarsgrunnlagVurdering.IkkeOppfylt:
            return false;
        case VilkarsgrunnlagVurdering.IkkeVurdert:
            return null;
    }
}
