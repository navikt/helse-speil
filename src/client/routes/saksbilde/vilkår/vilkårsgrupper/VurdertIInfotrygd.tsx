import React from 'react';
import { Vilkårsgruppetittel } from '../vilkårstitler';
import { Vilkårdata } from '../../../../mapping/vilkår';
import { Vilkårkolonne, Vilkårgrid, BehandletVarselContent } from '../Vilkår.styles';
import { BehandletAvInfotrygdVarsel } from '@navikt/helse-frontend-varsel';

interface VurdertIInfotrygdProps {
    vilkår: Vilkårdata[];
}

export const VurdertIInfotrygd = ({ vilkår }: VurdertIInfotrygdProps) => (
    <Vilkårkolonne data-testid="vurdert-i-infotrygd">
        <BehandletAvInfotrygdVarsel tittel="Inngangsvilkår vurdert i Infotrygd">
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
        </BehandletAvInfotrygdVarsel>
    </Vilkårkolonne>
);
