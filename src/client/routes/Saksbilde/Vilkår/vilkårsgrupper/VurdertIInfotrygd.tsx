import React from 'react';
import { Vilkårsgruppetittel } from '../vilkårstitler';
import { Vilkårdata } from '../../../../mapping/vilkår';
import BehandletAvInfotrygd from '@navikt/helse-frontend-behandlet-av-infotrygd';
import { Vilkårkolonne } from '../Vilkår.styles';
import styled from '@emotion/styled';

export const BehandletInnholdContainer = styled(BehandletAvInfotrygd)`
    > *:nth-child(2) {
        margin-bottom: 1rem;
    }
`;

interface VurdertIInfotrygdProps {
    vilkår: Vilkårdata[];
}

export const VurdertIInfotrygd = ({ vilkår }: VurdertIInfotrygdProps) => (
    <Vilkårkolonne data-testid="vurdert-i-infotrygd">
        <BehandletInnholdContainer tittel="Inngangsvilkår vurdert i Infotrygd">
            {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
                <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf} key={i}>
                    {tittel}
                </Vilkårsgruppetittel>
            ))}
        </BehandletInnholdContainer>
    </Vilkårkolonne>
);
