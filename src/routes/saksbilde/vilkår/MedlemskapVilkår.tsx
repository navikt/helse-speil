import React, { ReactElement } from 'react';

import { Vurdering } from '@io/graphql';
import { getFormattedDatetimeString } from '@utils/date';

import { VilkårsutfallKort, utfallForOppfylt } from './VilkårsutfallKort';

interface MedlemskapVilkårProps {
    oppfylt: boolean | null;
    vurdertIInfotrygd: boolean;
    vurdering?: Vurdering | null;
}

export const MedlemskapVilkår = ({ oppfylt, vurdertIInfotrygd, vurdering }: MedlemskapVilkårProps): ReactElement => {
    const utfall = utfallForOppfylt(oppfylt);

    const vurdertTagTekst = vurdertIInfotrygd
        ? 'Vurdert i Infotrygd'
        : vurdering?.automatisk
          ? `Vurdert automatisk ${getFormattedDatetimeString(vurdering.tidsstempel)}`
          : vurdering
            ? `Vurdert ${getFormattedDatetimeString(vurdering.tidsstempel)} – ${vurdering.ident}`
            : undefined;

    return (
        <VilkårsutfallKort
            titleId="medlemskap-tittel"
            testId="medlemskap"
            tittel="Lovvalg og medlemskap"
            utfall={utfall}
            vurdertTagTekst={vurdertTagTekst}
        />
    );
};
