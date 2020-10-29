import React from 'react';
import { FlexColumn } from '../../../../components/Flex';
import { Vilkårstittel } from '../Vilkårstittel';
import { Vilkårgrid } from '../Vilkår.styles';
import { Vilkårdata } from '../../../../mapping/vilkår';
import { Kryssikon } from '../../../../components/ikoner/Kryssikon';
import { Feilikon } from '../../../../components/ikoner/Feilikon';

interface IkkeOppfylteVilkårProps {
    vilkår: Vilkårdata[];
}

export const IkkeOppfylteVilkår = ({ vilkår }: IkkeOppfylteVilkårProps) => (
    <FlexColumn>
        <Vilkårstittel ikon={<Feilikon />} størrelse="m">
            Ikke oppfylte vilkår
        </Vilkårstittel>
        {vilkår.map(({ tittel, paragraf, komponent }, i) => (
            <React.Fragment key={i}>
                <Vilkårstittel ikon={<Kryssikon />} paragraf={paragraf}>
                    {tittel}
                </Vilkårstittel>
                <Vilkårgrid>{komponent}</Vilkårgrid>
            </React.Fragment>
        ))}
    </FlexColumn>
);
