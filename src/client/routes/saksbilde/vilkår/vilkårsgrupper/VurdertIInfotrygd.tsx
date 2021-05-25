import React from 'react';

import { BehandletAvInfotrygdVarsel } from '@navikt/helse-frontend-varsel';

import { Vilkårdata } from '../../../../mapping/vilkår';

import { Vilkårkolonne, Vilkårgrid, BehandletVarselContent } from '../Vilkår.styles';
import { Vilkårsgruppetittel } from '../vilkårstitler';

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
