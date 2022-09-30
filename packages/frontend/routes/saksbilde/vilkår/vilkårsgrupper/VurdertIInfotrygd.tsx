import { Vilkårdata } from '../../../../mapping/vilkår';
import { BehandletVarselContent, Vilkårgrid, Vilkårgruppe } from '../Vilkår.styles';
import { Vilkårsgruppetittel } from '../vilkårstitler';
import React from 'react';

import { Infotrygdvurdering } from '@components/Infotrygdvurdering';

interface VurdertIInfotrygdProps {
    vilkår: Vilkårdata[];
}

export const VurdertIInfotrygd = ({ vilkår }: VurdertIInfotrygdProps) => (
    <Infotrygdvurdering title="Inngangsvilkår vurdert i Infotrygd">
        <BehandletVarselContent data-testid="vurdert-i-infotrygd" aria-label="Vilkår vurdert i Infotrygd">
            {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
                <Vilkårgruppe key={i}>
                    <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf}>
                        {tittel}
                    </Vilkårsgruppetittel>
                    <Vilkårgrid />
                </Vilkårgruppe>
            ))}
        </BehandletVarselContent>
    </Infotrygdvurdering>
);
