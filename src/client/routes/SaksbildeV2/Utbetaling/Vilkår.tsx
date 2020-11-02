import { Sjekkikon } from '../../../components/ikoner/Sjekkikon';
import { Feilikon } from '../../../components/ikoner/Feilikon';
import { Advarselikon } from '../../../components/ikoner/Advarselikon';
import styled from '@emotion/styled';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

const vurderingsikon = (vurdering: Vurdering) => {
    switch (vurdering) {
        case Vurdering.Oppfylt:
            return <Sjekkikon />;
        case Vurdering.IkkeOppfylt:
            return <Feilikon />;
        case Vurdering.IkkeVurdert:
            return <Advarselikon />;
    }
};

const Vilkår = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 0.75rem;
`;

const Vilkårnavn = styled(Normaltekst)`
    margin-left: 1rem;
`;

const Vilkårikon = styled.span`
    display: flex;
    flex-shrink: 0;
    width: 20px;
    height: 24px;
    align-items: center;
    justify-content: center;
`;

export enum Vurdering {
    IkkeVurdert,
    IkkeOppfylt,
    Oppfylt,
}

export interface VurdertVilkår {
    vurdering: Vurdering;
    navn: string;
}

interface VurdertVilkårProps {
    vilkår: VurdertVilkår;
}

export const VurdertVilkår = ({ vilkår }: VurdertVilkårProps) => (
    <Vilkår>
        <Vilkårikon>{vurderingsikon(vilkår.vurdering)}</Vilkårikon>
        <Vilkårnavn>{vilkår.navn}</Vilkårnavn>
    </Vilkår>
);
