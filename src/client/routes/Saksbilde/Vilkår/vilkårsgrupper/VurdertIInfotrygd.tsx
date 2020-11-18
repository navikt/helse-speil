import React from 'react';
import { Vilkårsgruppetittel } from '../vilkårstitler';
import { Vilkårdata } from '../../../../mapping/vilkår';
import BehandletAvInfotrygd from '@navikt/helse-frontend-behandlet-av-infotrygd';
import { Vilkårkolonne, Vilkårgrid, BehandletVarselContent } from '../Vilkår.styles';

interface VurdertIInfotrygdProps {
    vilkår: Vilkårdata[];
}

export const VurdertIInfotrygd = ({ vilkår }: VurdertIInfotrygdProps) => (
    <Vilkårkolonne data-testid="vurdert-i-infotrygd">
        <BehandletAvInfotrygd tittel="Inngangsvilkår vurdert i Infotrygd">
            <BehandletVarselContent>
                {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
                    <React.Fragment key={i}>
                        <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf}>
                            {tittel}
                        </Vilkårsgruppetittel>
                        <Vilkårgrid />
                    </React.Fragment>
                ))}
            </BehandletVarselContent>
        </BehandletAvInfotrygd>
    </Vilkårkolonne>
);
