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
    <FlexColumn data-testid="ikke-oppfylte-vilkår">
        <Vilkårstittel ikon={<Feilikon />} størrelse="m">
            Ikke oppfylte vilkår
        </Vilkårstittel>
        {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
            <React.Fragment key={i}>
                <Vilkårstittel type={type} ikon={<Kryssikon />} paragraf={paragraf}>
                    {tittel}
                </Vilkårstittel>
                <Vilkårgrid>{komponent}</Vilkårgrid>
            </React.Fragment>
        ))}
    </FlexColumn>
);
