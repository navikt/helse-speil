import React from 'react';

import { BehandletVarsel } from '@navikt/helse-frontend-varsel';

import { Vilkårdata } from '../../../../mapping/vilkår';

import { BehandletVarselContent, Vilkårgrid, Vilkårgruppe } from '../Vilkår.styles';
import { Vilkårsgruppetittel } from '../vilkårstitler';

interface VurdertAutomatiskProps {
    vilkår: Vilkårdata[];
    saksbehandler?: string;
}

export const VurdertAutomatisk = ({ vilkår, saksbehandler }: VurdertAutomatiskProps) => (
    <BehandletVarsel
        tittel="Vilkår vurdert for denne perioden"
        saksbehandler={saksbehandler ?? 'Ukjent'}
        automatiskBehandlet
    >
        <BehandletVarselContent data-testid="vurdert-automatisk" aria-label="Vilkår vurdert automatisk">
            {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
                <Vilkårgruppe key={i}>
                    <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf}>
                        {tittel}
                    </Vilkårsgruppetittel>
                    <Vilkårgrid>{komponent}</Vilkårgrid>
                </Vilkårgruppe>
            ))}
        </BehandletVarselContent>
    </BehandletVarsel>
);
