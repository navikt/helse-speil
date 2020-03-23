import React, { ReactNode } from 'react';
import { Strek, StyledUbehandletInnhold } from './Vilkår.styles';
import { FlexColumn } from '../../components/FlexColumn';
import styled from '@emotion/styled';
import Vilkårstittel from './Vilkårstittel';

interface VilkårsvisningProps {
    tittel: string;
    ikon: ReactNode;
    vilkår: ReactNode[];
}

const Tittel = styled(Vilkårstittel)`
    margin-top: 2rem;
    margin-left: 2rem;
`;

const Vilkårsvisning = ({ tittel, ikon, vilkår }: VilkårsvisningProps) => {
    const midten = Math.ceil(vilkår.length / 2);
    const venstre = vilkår.slice(0, midten);
    const høyre = vilkår.slice(midten);

    return (
        <>
            <Tittel størrelse="m" ikon={ikon}>
                {tittel}
            </Tittel>
            <StyledUbehandletInnhold kolonner={2}>
                <FlexColumn>{venstre}</FlexColumn>
                <FlexColumn>{høyre}</FlexColumn>
            </StyledUbehandletInnhold>
            <Strek />
        </>
    );
};

export default Vilkårsvisning;
