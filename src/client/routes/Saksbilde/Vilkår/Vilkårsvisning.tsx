import React, { ReactNode } from 'react';
import { Strek, StyledUbehandletInnhold, Vilkårinnhold } from './Vilkår.styles';
import Vilkårstittel from './Vilkårstittel';
import { FlexColumn } from '../../../components/Flex';
import { ArbeidsuførhetVurdert } from './Vilkårsgrupper/Vilkårsgrupper';
import { Risikovurdering } from 'internal-types';

interface VilkårsvisningProps {
    tittel: string;
    ikon: ReactNode;
    vilkår: ReactNode[];
    risikovurdering?: Risikovurdering;
}

const Vilkårsvisning = ({ tittel, ikon, vilkår, risikovurdering }: VilkårsvisningProps) => {
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
                    <FlexColumn>
                        {høyre}
                        {ArbeidsuførhetVurdert(risikovurdering)}
                    </FlexColumn>
                </StyledUbehandletInnhold>
            </Vilkårinnhold>
            <Strek />
        </>
    );
};

export default Vilkårsvisning;
