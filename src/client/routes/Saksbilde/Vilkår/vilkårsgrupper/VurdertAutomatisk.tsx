import React from 'react';
import styled from '@emotion/styled';
import { Vilkårdata } from '../../../../mapping/vilkår';
import { Vilkårsgruppetittel } from '../vilkårstitler';
import { BehandletInnholdContainer, Vilkårgrid, Vilkårkolonne } from '../Vilkår.styles';

const VurdertTittel = styled(Vilkårsgruppetittel)`
    &:not(:last-of-type) {
        margin: 1rem 0;
    }
`;

interface VurdertAutomatiskProps {
    vilkår: Vilkårdata[];
    saksbehandler?: string;
}

export const VurdertAutomatisk = ({ vilkår, saksbehandler }: VurdertAutomatiskProps) => (
    <Vilkårkolonne data-testid="vurdert-automatisk">
        <BehandletInnholdContainer
            tittel="Vilkår vurdert for denne perioden"
            saksbehandler={saksbehandler ?? 'Ukjent'}
            automatiskBehandlet
        >
            {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
                <React.Fragment key={i}>
                    <VurdertTittel type={type} oppfylt={true} paragraf={paragraf}>
                        {tittel}
                    </VurdertTittel>
                    {komponent && <Vilkårgrid>{komponent}</Vilkårgrid>}
                </React.Fragment>
            ))}
        </BehandletInnholdContainer>
    </Vilkårkolonne>
);
