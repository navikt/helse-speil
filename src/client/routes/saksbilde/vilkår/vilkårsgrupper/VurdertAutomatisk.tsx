import React from 'react';

import { BehandletVarsel } from '@navikt/helse-frontend-varsel';

import { Vilkårdata } from '../../../../mapping/vilkår';

import { BehandletVarselContent, Vilkårgrid, Vilkårkolonne } from '../Vilkår.styles';
import { Vilkårsgruppetittel } from '../vilkårstitler';

interface VurdertAutomatiskProps {
    vilkår: Vilkårdata[];
    saksbehandler?: string;
}

export const VurdertAutomatisk = ({ vilkår, saksbehandler }: VurdertAutomatiskProps) => (
    <Vilkårkolonne data-testid="vurdert-automatisk">
        <BehandletVarsel
            tittel="Vilkår vurdert for denne perioden"
            saksbehandler={saksbehandler ?? 'Ukjent'}
            automatiskBehandlet
        >
            <BehandletVarselContent>
                {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
                    <React.Fragment key={i}>
                        <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf}>
                            {tittel}
                        </Vilkårsgruppetittel>
                        <Vilkårgrid>{komponent}</Vilkårgrid>
                    </React.Fragment>
                ))}
            </BehandletVarselContent>
        </BehandletVarsel>
    </Vilkårkolonne>
);
