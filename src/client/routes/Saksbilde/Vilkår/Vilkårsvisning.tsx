import React, { ReactNode } from 'react';
import { Strek, StyledUbehandletInnhold, Vilkårinnhold } from './Vilkår.styles';
import { FlexColumn } from '../../../components/FlexColumn';
import Vilkårstittel from './Vilkårstittel';

interface VilkårsvisningProps {
    tittel: string;
    ikon: ReactNode;
    vilkår: ReactNode[];
}

const Vilkårsvisning = ({ tittel, ikon, vilkår }: VilkårsvisningProps) => {
    const midten = Math.ceil(vilkår.length / 2);
    const venstre = vilkår.slice(0, midten);
    const høyre = vilkår.slice(midten);

    return (
        <>
            <Vilkårinnhold>
                <Vilkårstittel størrelse="m" ikon={ikon}>
                    {tittel}
                </Vilkårstittel>
                <StyledUbehandletInnhold gridTemplateColumns="37rem auto">
                    <FlexColumn>{venstre}</FlexColumn>
                    <FlexColumn>{høyre}</FlexColumn>
                </StyledUbehandletInnhold>
            </Vilkårinnhold>
            <Strek />
        </>
    );
};

export default Vilkårsvisning;
